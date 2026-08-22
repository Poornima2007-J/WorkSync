using System.Text.Json.Serialization;

namespace Dayflow.Backend.Models
{
    public enum UserRole
    {
        Employee = 0,
        HR = 1,
        Admin = 2
    }

    public class User
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty; // e.g. EMP-101
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Employee;
        public bool IsEmailVerified { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public EmployeeProfile? Profile { get; set; }
    }
}
