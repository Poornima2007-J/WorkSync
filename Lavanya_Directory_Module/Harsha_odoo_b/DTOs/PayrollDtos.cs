namespace Dayflow.Backend.DTOs
{
    public class SalaryStructureDto
    {
        public int UserId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal BasicPay { get; set; }
        public decimal HRA { get; set; }
        public decimal SpecialAllowance { get; set; }
        public decimal PerformanceBonus { get; set; }
        public decimal ProvidentFund { get; set; }
        public decimal ProfessionalTax { get; set; }
        public decimal TDS { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal TotalDeductions { get; set; }
        public decimal NetSalary { get; set; }
        public string Currency { get; set; } = "INR (₹)";
        public string BankAccountNumber { get; set; } = string.Empty;
        public string IFSCNumber { get; set; } = string.Empty;
        public string PANNumber { get; set; } = string.Empty;
    }

    public class UpdateSalaryDto
    {
        public decimal BasicPay { get; set; }
        public decimal HRA { get; set; }
        public decimal SpecialAllowance { get; set; }
        public decimal PerformanceBonus { get; set; }
        public decimal ProvidentFund { get; set; }
        public decimal ProfessionalTax { get; set; }
        public decimal TDS { get; set; }
    }
}
