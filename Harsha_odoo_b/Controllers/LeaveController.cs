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
    public class LeaveController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveController(AppDbContext context)
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

        // POST: api/leave/apply
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyLeave([FromBody] CreateLeaveDto dto)
        {
            var userId = GetCurrentUserId();

            if (dto.EndDate < dto.StartDate)
            {
                return BadRequest(new { message = "End date cannot be prior to start date." });
            }

            var daysCount = (dto.EndDate.Date - dto.StartDate.Date).TotalDays + 1;

            var leaveRequest = new LeaveRequest
            {
                UserId = userId,
                LeaveType = dto.LeaveType,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                DaysCount = daysCount,
                Reason = dto.Reason,
                Status = LeaveStatus.Pending,
                AppliedAt = DateTime.UtcNow
            };

            _context.LeaveRequests.Add(leaveRequest);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Leave request submitted successfully!", leaveId = leaveRequest.Id });
        }

        // GET: api/leave/my-requests
        [HttpGet("my-requests")]
        public async Task<IActionResult> GetMyLeaveRequests()
        {
            var userId = GetCurrentUserId();

            var requests = await _context.LeaveRequests
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.AppliedAt)
                .Select(l => new LeaveResponseDto
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    LeaveType = l.LeaveType,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    DaysCount = l.DaysCount,
                    Reason = l.Reason,
                    Status = l.Status,
                    AdminComment = l.AdminComment,
                    AppliedAt = l.AppliedAt,
                    ReviewedAt = l.ReviewedAt
                })
                .ToListAsync();

            return Ok(requests);
        }

        // GET: api/leave/all (Admin/HR workflow desk)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllLeaveRequests([FromQuery] LeaveStatus? status)
        {
            if (!IsAdminOrHR()) return Forbid();

            var query = _context.LeaveRequests
                .Include(l => l.User)
                .ThenInclude(u => u!.Profile)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(l => l.Status == status.Value);
            }

            var requests = await query
                .OrderByDescending(l => l.AppliedAt)
                .Select(l => new LeaveResponseDto
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    EmployeeId = l.User != null ? l.User.EmployeeId : "",
                    EmployeeName = l.User != null && l.User.Profile != null ? $"{l.User.Profile.FirstName} {l.User.Profile.LastName}" : l.User!.Email,
                    Department = l.User != null && l.User.Profile != null ? l.User.Profile.Department : "",
                    LeaveType = l.LeaveType,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    DaysCount = l.DaysCount,
                    Reason = l.Reason,
                    Status = l.Status,
                    AdminComment = l.AdminComment,
                    AppliedAt = l.AppliedAt,
                    ReviewedAt = l.ReviewedAt
                })
                .ToListAsync();

            return Ok(requests);
        }

        // PUT: api/leave/review/{leaveId} (Admin/HR approval)
        [HttpPut("review/{leaveId}")]
        public async Task<IActionResult> ReviewLeaveRequest(int leaveId, [FromBody] ReviewLeaveDto dto)
        {
            if (!IsAdminOrHR()) return Forbid();

            var request = await _context.LeaveRequests
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.Id == leaveId);

            if (request == null) return NotFound(new { message = "Leave request not found." });

            request.Status = dto.Status;
            request.AdminComment = dto.AdminComment;
            request.ReviewedAt = DateTime.UtcNow;

            // If approved, create/update attendance records for those dates as OnLeave
            if (dto.Status == LeaveStatus.Approved)
            {
                for (var d = request.StartDate.Date; d <= request.EndDate.Date; d = d.AddDays(1))
                {
                    if (d.DayOfWeek == DayOfWeek.Saturday || d.DayOfWeek == DayOfWeek.Sunday) continue;

                    var existingAtt = await _context.Attendances.FirstOrDefaultAsync(a => a.UserId == request.UserId && a.Date.Date == d);
                    if (existingAtt == null)
                    {
                        _context.Attendances.Add(new Attendance
                        {
                            UserId = request.UserId,
                            Date = d,
                            Status = AttendanceStatus.OnLeave,
                            Remarks = $"Approved Leave ({request.LeaveType})"
                        });
                    }
                    else
                    {
                        existingAtt.Status = AttendanceStatus.OnLeave;
                        existingAtt.Remarks = $"Approved Leave ({request.LeaveType})";
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Leave request has been {dto.Status.ToString().ToLower()} successfully!" });
        }

        // GET: api/leave/balance/{userId?}
        [HttpGet("balance/{userId?}")]
        public async Task<IActionResult> GetLeaveBalance(int? userId)
        {
            var currentUserId = GetCurrentUserId();
            var targetId = userId ?? currentUserId;

            if (targetId != currentUserId && !IsAdminOrHR()) return Forbid();

            var approvedLeaves = await _context.LeaveRequests
                .Where(l => l.UserId == targetId && l.Status == LeaveStatus.Approved && l.StartDate.Year == DateTime.UtcNow.Year)
                .ToListAsync();

            var paidTaken = approvedLeaves.Where(l => l.LeaveType == LeaveType.Paid).Sum(l => l.DaysCount);
            var sickTaken = approvedLeaves.Where(l => l.LeaveType == LeaveType.Sick).Sum(l => l.DaysCount);
            var casualTaken = approvedLeaves.Where(l => l.LeaveType == LeaveType.Casual).Sum(l => l.DaysCount);
            var unpaidTaken = approvedLeaves.Where(l => l.LeaveType == LeaveType.Unpaid).Sum(l => l.DaysCount);

            var balance = new LeaveBalanceDto
            {
                PaidLeaveRemaining = Math.Max(0, 15 - (int)paidTaken),
                SickLeaveRemaining = Math.Max(0, 12 - (int)sickTaken),
                CasualLeaveRemaining = Math.Max(0, 10 - (int)casualTaken),
                UnpaidLeaveTaken = (int)unpaidTaken
            };

            return Ok(balance);
        }
    }
}
