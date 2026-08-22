namespace Dayflow.Backend.Models
{
    public class EmployeeProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; } = DateTime.UtcNow;
        public string EmergencyContact { get; set; } = string.Empty;
        public string BloodGroup { get; set; } = string.Empty;
        public string BankAccountNumber { get; set; } = string.Empty;
        public string IFSCNumber { get; set; } = string.Empty;
        public string PANNumber { get; set; } = string.Empty;

        // Navigation properties
        public User? User { get; set; }
        public SalaryStructure? SalaryStructure { get; set; }
    }
}
