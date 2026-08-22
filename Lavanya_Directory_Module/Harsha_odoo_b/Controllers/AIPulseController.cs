using Dayflow.Backend.Data;
using Dayflow.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Dayflow.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AIPulseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AIPulseController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == "sub");
            return int.Parse(claim?.Value ?? "0");
        }

        private bool IsAdminOrHR()
        {
            return User.IsInRole("Admin") || User.IsInRole("HR");
        }

        // POST: api/aipulse/check-in
        [HttpPost("check-in")]
        public async Task<IActionResult> LogMood([FromBody] MoodEntry entry)
        {
            var userId = GetCurrentUserId();

            entry.UserId = userId;
            entry.Date = DateTime.UtcNow;

            _context.MoodEntries.Add(entry);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Daily pulse check recorded! Thank you for sharing your feedback." });
        }

        // GET: api/aipulse/analytics
        [HttpGet("analytics")]
        public async Task<IActionResult> GetPulseAnalytics()
        {

            var recentMoods = await _context.MoodEntries
                .Include(m => m.User)
                .ThenInclude(u => u!.Profile)
                .OrderByDescending(m => m.Date)
                .Take(20)
                .ToListAsync();

            var totalEntries = recentMoods.Count;
            var avgEnergy = totalEntries > 0 ? Math.Round(recentMoods.Average(m => m.EnergyScore), 1) : 8.0;

            var moodCounts = recentMoods
                .GroupBy(m => m.Mood)
                .Select(g => new { mood = g.Key, count = g.Count() })
                .ToList();

            var stressedOrExhaustedCount = recentMoods.Count(m => m.Mood == "Stressed" || m.Mood == "Exhausted" || m.EnergyScore <= 4);
            var burnoutRiskLevel = stressedOrExhaustedCount > 3 ? "High" : (stressedOrExhaustedCount > 1 ? "Moderate" : "Low");

            var aiRecommendations = new List<string>();
            if (burnoutRiskLevel == "High")
            {
                aiRecommendations.Add("Recommend scheduling a 1-on-1 team wellness sync this week.");
                aiRecommendations.Add("Consider introducing Friday Focus Hours without meetings.");
            }
            else if (burnoutRiskLevel == "Moderate")
            {
                aiRecommendations.Add("Encourage employees with consecutive overtime to take casual leave.");
                aiRecommendations.Add("Highlight upcoming festive holidays in company announcements.");
            }
            else
            {
                aiRecommendations.Add("Team energy levels are optimal! Keep up the positive work culture.");
                aiRecommendations.Add("Recognize top performers in the monthly town hall.");
            }

            var entries = recentMoods.Select(m => new
            {
                id = m.Id,
                employeeName = m.User != null && m.User.Profile != null ? $"{m.User.Profile.FirstName} {m.User.Profile.LastName}" : "Employee",
                department = m.User?.Profile?.Department ?? "Engineering",
                mood = m.Mood,
                energyScore = m.EnergyScore,
                remarks = m.Remarks,
                date = m.Date
            });

            return Ok(new
            {
                averageEnergy = avgEnergy,
                burnoutRiskLevel,
                moodDistribution = moodCounts,
                aiRecommendations,
                recentEntries = entries
            });
        }
    }
}
