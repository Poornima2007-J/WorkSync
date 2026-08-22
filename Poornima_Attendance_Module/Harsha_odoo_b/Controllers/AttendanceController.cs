using Dayflow.Backend.Data;
using Dayflow.Backend.DTOs;
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
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
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

        // POST: api/attendance/check-in
        [HttpPost("check-in")]
        public async Task<IActionResult> CheckIn([FromBody] CheckInDto dto)
        {
            var userId = GetCurrentUserId();
            var today = DateTime.UtcNow.Date;

            var existing = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Date.Date == today);

            if (existing != null && existing.CheckInTime.HasValue)
            {
                return BadRequest(new { message = "You have already checked in for today." });
            }

            if (existing == null)
            {
                existing = new Attendance
                {
                    UserId = userId,
                    Date = today
                };
                _context.Attendances.Add(existing);
            }

            existing.CheckInTime = DateTime.UtcNow;
            existing.Status = AttendanceStatus.Present;
            existing.Location = dto.Location;
            existing.Remarks = dto.Remarks;

            // Optional mood save during check-in
            if (!string.IsNullOrEmpty(dto.Mood))
            {
                var mood = new MoodEntry
                {
                    UserId = userId,
                    Date = DateTime.UtcNow,
                    Mood = dto.Mood,
                    EnergyScore = dto.EnergyScore ?? 8,
                    Remarks = dto.Remarks
                };
                _context.MoodEntries.Add(mood);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Checked in successfully!", checkInTime = existing.CheckInTime });
        }

        // POST: api/attendance/check-out
        [HttpPost("check-out")]
        public async Task<IActionResult> CheckOut([FromBody] CheckOutDto dto)
        {
            var userId = GetCurrentUserId();
            var today = DateTime.UtcNow.Date;

            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Date.Date == today);

            if (attendance == null || !attendance.CheckInTime.HasValue)
            {
                return BadRequest(new { message = "No active check-in record found for today." });
            }

            if (attendance.CheckOutTime.HasValue)
            {
                return BadRequest(new { message = "You have already checked out for today." });
            }

            attendance.CheckOutTime = DateTime.UtcNow;
            var timeSpan = attendance.CheckOutTime.Value - attendance.CheckInTime.Value;
            attendance.WorkingHours = Math.Round(timeSpan.TotalHours, 2);

            if (attendance.WorkingHours < 4.0)
            {
                attendance.Status = AttendanceStatus.HalfDay;
            }

            if (!string.IsNullOrEmpty(dto.Remarks))
            {
                attendance.Remarks = string.IsNullOrEmpty(attendance.Remarks)
                    ? dto.Remarks
                    : $"{attendance.Remarks} | Check-out: {dto.Remarks}";
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Checked out successfully!", checkOutTime = attendance.CheckOutTime, workingHours = attendance.WorkingHours });
        }

        // GET: api/attendance/today
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayStatus()
        {
            var userId = GetCurrentUserId();
            var today = DateTime.UtcNow.Date;

            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Date.Date == today);

            return Ok(new
            {
                isCheckedIn = attendance?.CheckInTime != null,
                isCheckedOut = attendance?.CheckOutTime != null,
                checkInTime = attendance?.CheckInTime,
                checkOutTime = attendance?.CheckOutTime,
                workingHours = attendance?.WorkingHours ?? 0,
                status = attendance?.Status.ToString() ?? "Not Checked In",
                location = attendance?.Location ?? "Office"
            });
        }

        // GET: api/attendance/my-history
        [HttpGet("my-history")]
        public async Task<IActionResult> GetMyHistory()
        {
            var userId = GetCurrentUserId();

            var records = await _context.Attendances
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.Date)
                .Take(30)
                .Select(a => new AttendanceRecordDto
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    Date = a.Date,
                    CheckInTime = a.CheckInTime,
                    CheckOutTime = a.CheckOutTime,
                    WorkingHours = a.WorkingHours,
                    Status = a.Status,
                    Location = a.Location,
                    Remarks = a.Remarks
                })
                .ToListAsync();

            return Ok(records);
        }

        // GET: api/attendance/all (Admin/HR view)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllAttendance([FromQuery] DateTime? date)
        {
            if (!IsAdminOrHR()) return Forbid();

            var targetDate = date?.Date ?? DateTime.UtcNow.Date;

            var query = await _context.Users
                .Include(u => u.Profile)
                .Select(u => new
                {
                    User = u,
                    Attendance = _context.Attendances.FirstOrDefault(a => a.UserId == u.Id && a.Date.Date == targetDate)
                })
                .ToListAsync();

            var result = query.Select(q => new AttendanceRecordDto
            {
                Id = q.Attendance?.Id ?? 0,
                UserId = q.User.Id,
                EmployeeId = q.User.EmployeeId,
                EmployeeName = q.User.Profile != null ? $"{q.User.Profile.FirstName} {q.User.Profile.LastName}" : q.User.Email,
                Department = q.User.Profile?.Department ?? "General",
                Date = targetDate,
                CheckInTime = q.Attendance?.CheckInTime,
                CheckOutTime = q.Attendance?.CheckOutTime,
                WorkingHours = q.Attendance?.WorkingHours ?? 0,
                Status = q.Attendance?.Status ?? AttendanceStatus.Absent,
                Location = q.Attendance?.Location ?? "Office",
                Remarks = q.Attendance?.Remarks ?? "No log for date"
            }).ToList();

            return Ok(result);
        }
    }
}
