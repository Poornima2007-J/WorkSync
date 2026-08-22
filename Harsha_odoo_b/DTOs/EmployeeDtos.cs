using Dayflow.Backend.Models;

namespace Dayflow.Backend.DTOs
{
    public class EmployeeProfileDto
    {
        public int UserId { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; }
        public string EmergencyContact { get; set; } = string.Empty;
        public string BloodGroup { get; set; } = string.Empty;
        public string BankAccountNumber { get; set; } = string.Empty;
        public string IFSCNumber { get; set; } = string.Empty;
        public string PANNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }

    public class UpdateEmployeeProfileDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string EmergencyContact { get; set; } = string.Empty;
        public string BloodGroup { get; set; } = string.Empty;

        // Admin fields (optional if non-admin update)
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public UserRole? Role { get; set; }
    }
}
