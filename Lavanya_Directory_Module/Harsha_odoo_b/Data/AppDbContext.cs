using Dayflow.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Dayflow.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<EmployeeProfile> Profiles => Set<EmployeeProfile>();
        public DbSet<Attendance> Attendances => Set<Attendance>();
        public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
        public DbSet<SalaryStructure> SalaryStructures => Set<SalaryStructure>();
        public DbSet<MoodEntry> MoodEntries => Set<MoodEntry>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cascade deletes & relationships
            modelBuilder.Entity<EmployeeProfile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<EmployeeProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SalaryStructure>()
                .HasOne(s => s.User)
                .WithOne()
                .HasForeignKey<SalaryStructure>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MoodEntry>()
                .HasOne(m => m.User)
                .WithMany()
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public void SeedInitialData()
        {
            if (Users.Any()) return; // Database already seeded

            var defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123");

            // 1. Harshavardhan (Employee)
            var emp1 = new User
            {
                EmployeeId = "EMP-101",
                Email = "harsha@dayflow.in",
                PasswordHash = defaultPasswordHash,
                Role = UserRole.Employee,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-12)
            };

            // 2. Lavanya (Employee)
            var emp2 = new User
            {
                EmployeeId = "EMP-102",
                Email = "lavanya@dayflow.in",
                PasswordHash = defaultPasswordHash,
                Role = UserRole.Employee,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            };

            // 3. Poornima (Employee)
            var emp3 = new User
            {
                EmployeeId = "EMP-103",
                Email = "poornima@dayflow.in",
                PasswordHash = defaultPasswordHash,
                Role = UserRole.Employee,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            };

            // 4. Manimegalai (Employee)
            var emp4 = new User
            {
                EmployeeId = "EMP-104",
                Email = "manimegalai@dayflow.in",
                PasswordHash = defaultPasswordHash,
                Role = UserRole.Employee,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            };

            Users.AddRange(emp1, emp2, emp3, emp4);
            SaveChanges();

            // Profiles for the 4 employees
            var profiles = new List<EmployeeProfile>
            {
                new EmployeeProfile
                {
                    UserId = emp1.Id,
                    FirstName = "Harshavardhan",
                    LastName = "R",
                    Department = "Engineering",
                    Designation = "Senior Full Stack Engineer",
                    Phone = "+91 98765 43210",
                    Address = "Cyber Tech Park, HSR Layout, Bengaluru, Karnataka",
                    AvatarUrl = "",
                    DateOfJoining = DateTime.UtcNow.AddYears(-1),
                    EmergencyContact = "+91 98765 00000",
                    BloodGroup = "O+",
                    BankAccountNumber = "918237465012",
                    IFSCNumber = "HDFC0001234",
                    PANNumber = "HARSH1234F"
                },
                new EmployeeProfile
                {
                    UserId = emp2.Id,
                    FirstName = "Lavanya",
                    LastName = "S",
                    Department = "UI/UX Design",
                    Designation = "Lead Product Designer",
                    Phone = "+91 98123 45678",
                    Address = "Indiranagar 100ft Road, Bengaluru, Karnataka",
                    AvatarUrl = "",
                    DateOfJoining = DateTime.UtcNow.AddMonths(-8),
                    EmergencyContact = "+91 98123 99999",
                    BloodGroup = "B+",
                    BankAccountNumber = "409823105678",
                    IFSCNumber = "SBIN0005678",
                    PANNumber = "LAVAN5678K"
                },
                new EmployeeProfile
                {
                    UserId = emp3.Id,
                    FirstName = "Poornima",
                    LastName = "M",
                    Department = "Product Operations",
                    Designation = "Operations Specialist",
                    Phone = "+91 99887 76655",
                    Address = "T. Nagar, Chennai, Tamil Nadu",
                    AvatarUrl = "",
                    DateOfJoining = DateTime.UtcNow.AddMonths(-6),
                    EmergencyContact = "+91 99887 00000",
                    BloodGroup = "A+",
                    BankAccountNumber = "5010023456789",
                    IFSCNumber = "ICIC0009876",
                    PANNumber = "POORN9876P"
                },
                new EmployeeProfile
                {
                    UserId = emp4.Id,
                    FirstName = "Manimegalai",
                    LastName = "K",
                    Department = "Engineering",
                    Designation = "Software Engineer",
                    Phone = "+91 97112 23344",
                    Address = "Gachibowli, Hyderabad, Telangana",
                    AvatarUrl = "",
                    DateOfJoining = DateTime.UtcNow.AddMonths(-3),
                    EmergencyContact = "+91 97112 99999",
                    BloodGroup = "AB+",
                    BankAccountNumber = "319800045612",
                    IFSCNumber = "AXIS0004321",
                    PANNumber = "MANIM4321R"
                }
            };
            Profiles.AddRange(profiles);

            // Salaries for the 4 employees
            var salaries = new List<SalaryStructure>
            {
                new SalaryStructure
                {
                    UserId = emp1.Id,
                    BasicPay = 65000,
                    HRA = 32500,
                    SpecialAllowance = 25000,
                    PerformanceBonus = 10000,
                    ProvidentFund = 7800,
                    ProfessionalTax = 200,
                    TDS = 8000
                },
                new SalaryStructure
                {
                    UserId = emp2.Id,
                    BasicPay = 55000,
                    HRA = 27500,
                    SpecialAllowance = 22000,
                    PerformanceBonus = 8000,
                    ProvidentFund = 6600,
                    ProfessionalTax = 200,
                    TDS = 6000
                },
                new SalaryStructure
                {
                    UserId = emp3.Id,
                    BasicPay = 50000,
                    HRA = 25000,
                    SpecialAllowance = 20000,
                    PerformanceBonus = 6000,
                    ProvidentFund = 6000,
                    ProfessionalTax = 200,
                    TDS = 4800
                },
                new SalaryStructure
                {
                    UserId = emp4.Id,
                    BasicPay = 60000,
                    HRA = 30000,
                    SpecialAllowance = 25000,
                    PerformanceBonus = 9000,
                    ProvidentFund = 7200,
                    ProfessionalTax = 200,
                    TDS = 7000
                }
            };
            SalaryStructures.AddRange(salaries);

            // Past Attendance Records
            var today = DateTime.UtcNow.Date;
            var attendances = new List<Attendance>();

            for (int i = 6; i >= 0; i--)
            {
                var day = today.AddDays(-i);
                if (day.DayOfWeek == DayOfWeek.Saturday || day.DayOfWeek == DayOfWeek.Sunday) continue;

                // Harshavardhan
                attendances.Add(new Attendance
                {
                    UserId = emp1.Id,
                    Date = day,
                    CheckInTime = day.AddHours(9).AddMinutes(15),
                    CheckOutTime = day.AddHours(18).AddMinutes(30),
                    WorkingHours = 9.25,
                    Status = AttendanceStatus.Present,
                    Location = "Office",
                    Remarks = "On time"
                });

                // Lavanya
                attendances.Add(new Attendance
                {
                    UserId = emp2.Id,
                    Date = day,
                    CheckInTime = day.AddHours(9).AddMinutes(20),
                    CheckOutTime = day.AddHours(18).AddMinutes(15),
                    WorkingHours = 8.9,
                    Status = AttendanceStatus.Present,
                    Location = "Office",
                    Remarks = "On time"
                });

                // Poornima
                attendances.Add(new Attendance
                {
                    UserId = emp3.Id,
                    Date = day,
                    CheckInTime = day.AddHours(10).AddMinutes(0),
                    CheckOutTime = day.AddHours(19).AddMinutes(0),
                    WorkingHours = 9.0,
                    Status = AttendanceStatus.Present,
                    Location = "Remote (WFH)",
                    Remarks = "Approved WFH"
                });

                // Manimegalai
                attendances.Add(new Attendance
                {
                    UserId = emp4.Id,
                    Date = day,
                    CheckInTime = day.AddHours(9).AddMinutes(30),
                    CheckOutTime = day.AddHours(18).AddMinutes(30),
                    WorkingHours = 9.0,
                    Status = AttendanceStatus.Present,
                    Location = "Office",
                    Remarks = "Active engineering sprint"
                });
            }
            Attendances.AddRange(attendances);

            // Sample Leave Requests
            var leaves = new List<LeaveRequest>
            {
                new LeaveRequest
                {
                    UserId = emp2.Id,
                    LeaveType = LeaveType.Paid,
                    StartDate = today.AddDays(4),
                    EndDate = today.AddDays(6),
                    DaysCount = 3,
                    Reason = "Annual family vacation & festival celebration",
                    Status = LeaveStatus.Pending,
                    AdminComment = "",
                    AppliedAt = DateTime.UtcNow.AddDays(-1)
                },
                new LeaveRequest
                {
                    UserId = emp3.Id,
                    LeaveType = LeaveType.Sick,
                    StartDate = today.AddDays(-10),
                    EndDate = today.AddDays(-9),
                    DaysCount = 2,
                    Reason = "Viral fever rest",
                    Status = LeaveStatus.Approved,
                    AdminComment = "Medical slip verified.",
                    AppliedAt = DateTime.UtcNow.AddDays(-12),
                    ReviewedAt = DateTime.UtcNow.AddDays(-11)
                },
                new LeaveRequest
                {
                    UserId = emp4.Id,
                    LeaveType = LeaveType.Casual,
                    StartDate = today.AddDays(8),
                    EndDate = today.AddDays(8),
                    DaysCount = 1,
                    Reason = "Personal work at municipality office",
                    Status = LeaveStatus.Pending,
                    AdminComment = "",
                    AppliedAt = DateTime.UtcNow.AddHours(-5)
                }
            };
            LeaveRequests.AddRange(leaves);

            // Mood Entries
            var moods = new List<MoodEntry>
            {
                new MoodEntry { UserId = emp1.Id, Date = today, Mood = "Great", EnergyScore = 9, Remarks = "Completed major sprint milestone!" },
                new MoodEntry { UserId = emp2.Id, Date = today, Mood = "Great", EnergyScore = 9, Remarks = "Design sprint approved!" },
                new MoodEntry { UserId = emp3.Id, Date = today, Mood = "Good", EnergyScore = 8, Remarks = "Smooth ops review session." },
                new MoodEntry { UserId = emp4.Id, Date = today, Mood = "Good", EnergyScore = 8, Remarks = "API deployment successful!" }
            };
            MoodEntries.AddRange(moods);

            SaveChanges();
        }
    }
}
