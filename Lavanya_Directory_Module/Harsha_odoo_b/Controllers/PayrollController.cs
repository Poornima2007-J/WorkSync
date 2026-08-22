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
    public class PayrollController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PayrollController(AppDbContext context)
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

        // GET: api/payroll/my-salary
        [HttpGet("my-salary")]
        public async Task<IActionResult> GetMySalary()
        {
            var userId = GetCurrentUserId();

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();

            var salary = await _context.SalaryStructures
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (salary == null)
            {
                salary = new SalaryStructure
                {
                    UserId = userId,
                    BasicPay = 40000,
                    HRA = 20000,
                    SpecialAllowance = 15000,
                    PerformanceBonus = 5000,
                    ProvidentFund = 4800,
                    ProfessionalTax = 200,
                    TDS = 3000
                };
                _context.SalaryStructures.Add(salary);
                await _context.SaveChangesAsync();
            }

            var dto = new SalaryStructureDto
            {
                UserId = user.Id,
                EmployeeId = user.EmployeeId,
                EmployeeName = user.Profile != null ? $"{user.Profile.FirstName} {user.Profile.LastName}" : user.Email,
                Designation = user.Profile?.Designation ?? "Employee",
                Department = user.Profile?.Department ?? "General",
                BasicPay = salary.BasicPay,
                HRA = salary.HRA,
                SpecialAllowance = salary.SpecialAllowance,
                PerformanceBonus = salary.PerformanceBonus,
                ProvidentFund = salary.ProvidentFund,
                ProfessionalTax = salary.ProfessionalTax,
                TDS = salary.TDS,
                GrossSalary = salary.GrossSalary,
                TotalDeductions = salary.TotalDeductions,
                NetSalary = salary.NetSalary,
                Currency = salary.Currency,
                BankAccountNumber = user.Profile?.BankAccountNumber ?? "N/A",
                IFSCNumber = user.Profile?.IFSCNumber ?? "N/A",
                PANNumber = user.Profile?.PANNumber ?? "N/A"
            };

            return Ok(dto);
        }

        // GET: api/payroll/all (Admin view)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPayroll()
        {
            if (!IsAdminOrHR()) return Forbid();

            var users = await _context.Users
                .Include(u => u.Profile)
                .ToListAsync();

            var salaries = await _context.SalaryStructures.ToListAsync();

            var list = users.Select(u =>
            {
                var sal = salaries.FirstOrDefault(s => s.UserId == u.Id) ?? new SalaryStructure { UserId = u.Id };
                return new SalaryStructureDto
                {
                    UserId = u.Id,
                    EmployeeId = u.EmployeeId,
                    EmployeeName = u.Profile != null ? $"{u.Profile.FirstName} {u.Profile.LastName}" : u.Email,
                    Designation = u.Profile?.Designation ?? "Employee",
                    Department = u.Profile?.Department ?? "General",
                    BasicPay = sal.BasicPay,
                    HRA = sal.HRA,
                    SpecialAllowance = sal.SpecialAllowance,
                    PerformanceBonus = sal.PerformanceBonus,
                    ProvidentFund = sal.ProvidentFund,
                    ProfessionalTax = sal.ProfessionalTax,
                    TDS = sal.TDS,
                    GrossSalary = sal.GrossSalary,
                    TotalDeductions = sal.TotalDeductions,
                    NetSalary = sal.NetSalary,
                    Currency = sal.Currency,
                    BankAccountNumber = u.Profile?.BankAccountNumber ?? "N/A",
                    IFSCNumber = u.Profile?.IFSCNumber ?? "N/A",
                    PANNumber = u.Profile?.PANNumber ?? "N/A"
                };
            }).ToList();

            return Ok(list);
        }

        // PUT: api/payroll/update/{userId} (Admin view)
        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateSalaryStructure(int userId, [FromBody] UpdateSalaryDto dto)
        {
            if (!IsAdminOrHR()) return Forbid();

            var salary = await _context.SalaryStructures.FirstOrDefaultAsync(s => s.UserId == userId);
            if (salary == null)
            {
                salary = new SalaryStructure { UserId = userId };
                _context.SalaryStructures.Add(salary);
            }

            salary.BasicPay = dto.BasicPay;
            salary.HRA = dto.HRA;
            salary.SpecialAllowance = dto.SpecialAllowance;
            salary.PerformanceBonus = dto.PerformanceBonus;
            salary.ProvidentFund = dto.ProvidentFund;
            salary.ProfessionalTax = dto.ProfessionalTax;
            salary.TDS = dto.TDS;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Salary structure updated successfully!" });
        }
    }
}
