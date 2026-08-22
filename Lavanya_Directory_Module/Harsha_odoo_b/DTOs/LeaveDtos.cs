using Dayflow.Backend.Models;

namespace Dayflow.Backend.DTOs
{
    public class CreateLeaveDto
    {
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class ReviewLeaveDto
    {
        public LeaveStatus Status { get; set; } // Approved or Rejected
        public string AdminComment { get; set; } = string.Empty;
    }

    public class LeaveResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double DaysCount { get; set; }
        public string Reason { get; set; } = string.Empty;
        public LeaveStatus Status { get; set; }
        public string AdminComment { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
    }

    public class LeaveBalanceDto
    {
        public int PaidLeaveRemaining { get; set; } = 14;
        public int SickLeaveRemaining { get; set; } = 10;
        public int CasualLeaveRemaining { get; set; } = 8;
        public int UnpaidLeaveTaken { get; set; } = 0;
    }
}
