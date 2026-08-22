namespace Dayflow.Backend.Models
{
    public class SalaryStructure
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal BasicPay { get; set; } = 40000;
        public decimal HRA { get; set; } = 20000;
        public decimal SpecialAllowance { get; set; } = 15000;
        public decimal PerformanceBonus { get; set; } = 5000;
        public decimal ProvidentFund { get; set; } = 4800; // PF Deduction
        public decimal ProfessionalTax { get; set; } = 200; // PT
        public decimal TDS { get; set; } = 3000; // Tax Deducted at Source
        
        // Calculated
        public decimal GrossSalary => BasicPay + HRA + SpecialAllowance + PerformanceBonus;
        public decimal TotalDeductions => ProvidentFund + ProfessionalTax + TDS;
        public decimal NetSalary => GrossSalary - TotalDeductions;
        public string Currency { get; set; } = "INR (₹)";

        // Navigation
        public User? User { get; set; }
    }
}
