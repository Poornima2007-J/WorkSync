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
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
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

        // GET: api/employee/all (Admin/HR only)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllEmployees([FromQuery] string? search, [FromQuery] string? department)
        {
            if (!IsAdminOrHR()) return Forbid();

            var query = _context.Users
                .Include(u => u.Profile)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                query = query.Where(u => u.EmployeeId.ToLower().Contains(s) ||
                                         u.Email.ToLower().Contains(s) ||
                                         (u.Profile != null && (u.Profile.FirstName.ToLower().Contains(s) || u.Profile.LastName.ToLower().Contains(s))));
            }

            if (!string.IsNullOrWhiteSpace(department) && department != "All")
            {
                query = query.Where(u => u.Profile != null && u.Profile.Department == department);
            }

            var employees = await query.Select(u => new EmployeeProfileDto
            {
                UserId = u.Id,
                EmployeeId = u.EmployeeId,
                Email = u.Email,
                FirstName = u.Profile != null ? u.Profile.FirstName : "",
                LastName = u.Profile != null ? u.Profile.LastName : "",
                Department = u.Profile != null ? u.Profile.Department : "",
                Designation = u.Profile != null ? u.Profile.Designation : "",
                Phone = u.Profile != null ? u.Profile.Phone : "",
                Address = u.Profile != null ? u.Profile.Address : "",
                AvatarUrl = u.Profile != null ? u.Profile.AvatarUrl : "",
                DateOfJoining = u.Profile != null ? u.Profile.DateOfJoining : u.CreatedAt,
                EmergencyContact = u.Profile != null ? u.Profile.EmergencyContact : "",
                BloodGroup = u.Profile != null ? u.Profile.BloodGroup : "",
                BankAccountNumber = u.Profile != null ? u.Profile.BankAccountNumber : "",
                IFSCNumber = u.Profile != null ? u.Profile.IFSCNumber : "",
                PANNumber = u.Profile != null ? u.Profile.PANNumber : "",
                Role = u.Role
            }).ToListAsync();

            return Ok(employees);
        }

        // GET: api/employee/profile (Current User or target User)
        [HttpGet("profile/{userId?}")]
        public async Task<IActionResult> GetProfile(int? userId)
        {
            var currentUserId = GetCurrentUserId();
            var targetId = userId ?? currentUserId;

            if (targetId != currentUserId && !IsAdminOrHR())
            {
                return Forbid();
            }

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == targetId);

            if (user == null) return NotFound(new { message = "Employee profile not found." });

            var dto = new EmployeeProfileDto
            {
                UserId = user.Id,
                EmployeeId = user.EmployeeId,
                Email = user.Email,
                FirstName = user.Profile?.FirstName ?? "",
                LastName = user.Profile?.LastName ?? "",
                Department = user.Profile?.Department ?? "",
                Designation = user.Profile?.Designation ?? "",
                Phone = user.Profile?.Phone ?? "",
                Address = user.Profile?.Address ?? "",
                AvatarUrl = user.Profile?.AvatarUrl ?? "",
                DateOfJoining = user.Profile?.DateOfJoining ?? user.CreatedAt,
                EmergencyContact = user.Profile?.EmergencyContact ?? "",
                BloodGroup = user.Profile?.BloodGroup ?? "",
                BankAccountNumber = user.Profile?.BankAccountNumber ?? "",
                IFSCNumber = user.Profile?.IFSCNumber ?? "",
                PANNumber = user.Profile?.PANNumber ?? "",
                Role = user.Role
            };

            return Ok(dto);
        }

        // PUT: api/employee/profile/{userId?}
        [HttpPut("profile/{userId?}")]
        public async Task<IActionResult> UpdateProfile(int? userId, [FromBody] UpdateEmployeeProfileDto dto)
        {
            var currentUserId = GetCurrentUserId();
            var targetId = userId ?? currentUserId;

            if (targetId != currentUserId && !IsAdminOrHR())
            {
                return Forbid();
            }

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == targetId);

            if (user == null) return NotFound();

            if (user.Profile == null)
            {
                user.Profile = new EmployeeProfile { UserId = user.Id };
                _context.Profiles.Add(user.Profile);
            }

            // Editable fields for employee & admin
            if (!string.IsNullOrEmpty(dto.FirstName)) user.Profile.FirstName = dto.FirstName;
            if (!string.IsNullOrEmpty(dto.LastName)) user.Profile.LastName = dto.LastName;
            if (!string.IsNullOrEmpty(dto.Phone)) user.Profile.Phone = dto.Phone;
            if (!string.IsNullOrEmpty(dto.Address)) user.Profile.Address = dto.Address;
            if (!string.IsNullOrEmpty(dto.AvatarUrl)) user.Profile.AvatarUrl = dto.AvatarUrl;
            if (!string.IsNullOrEmpty(dto.EmergencyContact)) user.Profile.EmergencyContact = dto.EmergencyContact;
            if (!string.IsNullOrEmpty(dto.BloodGroup)) user.Profile.BloodGroup = dto.BloodGroup;

            // Admin only fields
            if (IsAdminOrHR())
            {
                if (!string.IsNullOrEmpty(dto.Department)) user.Profile.Department = dto.Department;
                if (!string.IsNullOrEmpty(dto.Designation)) user.Profile.Designation = dto.Designation;
                if (dto.Role.HasValue) user.Role = dto.Role.Value;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully!" });
        }
    }
}
