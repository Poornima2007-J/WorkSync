using Dayflow.Backend.Data;
using Dayflow.Backend.DTOs;
using Dayflow.Backend.Models;
using Dayflow.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dayflow.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "An account with this email already exists." });
            }

            if (await _context.Users.AnyAsync(u => u.EmployeeId == dto.EmployeeId))
            {
                return BadRequest(new { message = "An employee profile with this Employee ID already exists." });
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                EmployeeId = dto.EmployeeId,
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = dto.Role,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var profile = new EmployeeProfile
            {
                UserId = user.Id,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Department = dto.Department,
                Designation = dto.Designation,
                Phone = "+91 98000 00000",
                Address = "India",
                AvatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={dto.FirstName}",
                DateOfJoining = DateTime.UtcNow
            };

            var salary = new SalaryStructure
            {
                UserId = user.Id,
                BasicPay = 40000,
                HRA = 20000,
                SpecialAllowance = 15000,
                PerformanceBonus = 5000,
                ProvidentFund = 4800,
                ProfessionalTax = 200,
                TDS = 3000
            };

            _context.Profiles.Add(profile);
            _context.SalaryStructures.Add(salary);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                EmployeeId = user.EmployeeId,
                Email = user.Email,
                Role = user.Role.ToString(),
                FullName = $"{profile.FirstName} {profile.LastName}",
                AvatarUrl = profile.AvatarUrl,
                Department = profile.Department,
                Designation = profile.Designation
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password. Please check your credentials." });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                EmployeeId = user.EmployeeId,
                Email = user.Email,
                Role = user.Role.ToString(),
                FullName = user.Profile != null ? $"{user.Profile.FirstName} {user.Profile.LastName}" : user.Email,
                AvatarUrl = user.Profile?.AvatarUrl ?? "",
                Department = user.Profile?.Department ?? "",
                Designation = user.Profile?.Designation ?? ""
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                ?? User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();

            return Ok(new AuthResponseDto
            {
                Token = "", // Client already has token
                UserId = user.Id,
                EmployeeId = user.EmployeeId,
                Email = user.Email,
                Role = user.Role.ToString(),
                FullName = user.Profile != null ? $"{user.Profile.FirstName} {user.Profile.LastName}" : user.Email,
                AvatarUrl = user.Profile?.AvatarUrl ?? "",
                Department = user.Profile?.Department ?? "",
                Designation = user.Profile?.Designation ?? ""
            });
        }
    }
}
