using Dayflow.Backend.Models;

namespace Dayflow.Backend.DTOs
{
    public class CheckInDto
    {
        public string Location { get; set; } = "Office"; // Office or Remote
        public string Remarks { get; set; } = string.Empty;
        public string? Mood { get; set; } // Optional mood during check-in
        public int? EnergyScore { get; set; }
    }

    public class CheckOutDto
    {
        public string Remarks { get; set; } = string.Empty;
    }

    public class AttendanceRecordDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public double WorkingHours { get; set; }
        public AttendanceStatus Status { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
    }

    public class AttendanceSummaryDto
    {
        public int TotalDays { get; set; }
        public int PresentDays { get; set; }
        public int AbsentDays { get; set; }
        public int HalfDays { get; set; }
        public int LeaveDays { get; set; }
        public double TotalHoursWorked { get; set; }
        public double AverageHoursPerDay { get; set; }
        public int CurrentStreak { get; set; }
    }
}
