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
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
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

        // GET: api/dashboard/employee
        [HttpGet("employee")]
        public async Task<IActionResult> GetEmployeeDashboard()
        {
            var userId = GetCurrentUserId();
            var today = DateTime.UtcNow.Date;

            var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return NotFound();

            var todayAttendance = await _context.Attendances.FirstOrDefaultAsync(a => a.UserId == userId && a.Date.Date == today);
            var myLeaves = await _context.LeaveRequests.Where(l => l.UserId == userId).ToListAsync();
            var pendingLeaves = myLeaves.Count(l => l.Status == LeaveStatus.Pending);
            var approvedLeavesCount = myLeaves.Where(l => l.Status == LeaveStatus.Approved).Sum(l => l.DaysCount);

            var salary = await _context.SalaryStructures.FirstOrDefaultAsync(s => s.UserId == userId);

            // Recent activity feed
            var activity = new List<object>
            {
                new { title = "Check-in Status", time = todayAttendance?.CheckInTime?.ToString("hh:mm tt") ?? "Not Checked In", status = todayAttendance != null ? "Active" : "Pending" },
                new { title = "Leave Requests", time = $"{pendingLeaves} Pending", status = pendingLeaves > 0 ? "Action Needed" : "Up to Date" },
                new { title = "Latest Payroll", time = $"Net Pay: ₹{salary?.NetSalary ?? 0:N0}", status = "Processed" }
            };

            return Ok(new
            {
                employeeId = user.EmployeeId,
                fullName = user.Profile != null ? $"{user.Profile.FirstName} {user.Profile.LastName}" : user.Email,
                designation = user.Profile?.Designation ?? "Employee",
                department = user.Profile?.Department ?? "Department",
                avatarUrl = user.Profile?.AvatarUrl,
                todayCheckIn = todayAttendance?.CheckInTime,
                todayCheckOut = todayAttendance?.CheckOutTime,
                todayStatus = todayAttendance?.Status.ToString() ?? "Not Checked In",
                leaveBalance = Math.Max(0, 15 - (int)approvedLeavesCount),
                pendingLeavesCount = pendingLeaves,
                netSalary = salary?.NetSalary ?? 0,
                activityFeed = activity
            });
        }

        // GET: api/dashboard/admin
        [HttpGet("admin")]
        public async Task<IActionResult> GetAdminDashboard()
        {
            if (!IsAdminOrHR()) return Forbid();

            var today = DateTime.UtcNow.Date;

            var totalEmployees = await _context.Users.CountAsync();
            var todayAttendances = await _context.Attendances.Where(a => a.Date.Date == today).ToListAsync();

            var presentToday = todayAttendances.Count(a => a.Status == AttendanceStatus.Present);
            var halfDayToday = todayAttendances.Count(a => a.Status == AttendanceStatus.HalfDay);
            var onLeaveToday = todayAttendances.Count(a => a.Status == AttendanceStatus.OnLeave);
            var absentToday = Math.Max(0, totalEmployees - (presentToday + halfDayToday + onLeaveToday));

            var pendingLeavesCount = await _context.LeaveRequests.CountAsync(l => l.Status == LeaveStatus.Pending);
            var salaries = await _context.SalaryStructures.ToListAsync();
            var totalMonthlyPayroll = salaries.Sum(s => s.NetSalary);

            var recentLeaveRequests = await _context.LeaveRequests
                .Include(l => l.User)
                .ThenInclude(u => u!.Profile)
                .Where(l => l.Status == LeaveStatus.Pending)
                .Take(5)
                .Select(l => new
                {
                    id = l.Id,
                    employeeName = l.User != null && l.User.Profile != null ? $"{l.User.Profile.FirstName} {l.User.Profile.LastName}" : l.User!.Email,
                    leaveType = l.LeaveType.ToString(),
                    daysCount = l.DaysCount,
                    reason = l.Reason,
                    appliedAt = l.AppliedAt
                })
                .ToListAsync();

            return Ok(new
            {
                totalEmployees,
                presentToday,
                absentToday,
                onLeaveToday,
                pendingLeavesCount,
                totalMonthlyPayroll,
                recentLeaveRequests
            });
        }
    }
}
