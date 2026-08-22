namespace Dayflow.Backend.Models
{
    public enum AttendanceStatus
    {
        Present = 0,
        Absent = 1,
        HalfDay = 2,
        OnLeave = 3
    }

    public class Attendance
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public double WorkingHours { get; set; } = 0.0;
        public AttendanceStatus Status { get; set; } = AttendanceStatus.Present;
        public string Location { get; set; } = "Office"; // Office or Remote
        public string Remarks { get; set; } = string.Empty;

        // Navigation
        public User? User { get; set; }
    }
}
