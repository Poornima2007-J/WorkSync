namespace Dayflow.Backend.Models
{
    public enum LeaveType
    {
        Paid = 0,
        Sick = 1,
        Unpaid = 2,
        Casual = 3
    }

    public enum LeaveStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }

    public class LeaveRequest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public LeaveType LeaveType { get; set; } = LeaveType.Paid;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double DaysCount { get; set; } = 1.0;
        public string Reason { get; set; } = string.Empty;
        public LeaveStatus Status { get; set; } = LeaveStatus.Pending;
        public string AdminComment { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }

        // Navigation
        public User? User { get; set; }
    }
}
