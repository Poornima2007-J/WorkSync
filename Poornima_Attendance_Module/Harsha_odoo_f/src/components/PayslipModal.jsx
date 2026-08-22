import React from 'react';
import { X, Printer, IndianRupee, ShieldCheck } from 'lucide-react';

const PayslipModal = ({ salaryData, onClose }) => {
  if (!salaryData) return null;

  const handlePrint = () => {
    window.print();
  };

  const monthYear = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="modal-overlay">
      <div className="modal-card printable-payslip" style={{ maxWidth: '720px' }}>
        {/* Header & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div>
            <span className="badge badge-info"><ShieldCheck size={12} /> Verified Indian HR Payslip</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>Salary Slip - {monthYear}</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
              <Printer size={16} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Company Header */}
        <div style={{
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          backgroundColor: 'var(--bg-app)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)' }}>DAYFLOW TECHNOLOGIES PRIVATE LIMITED</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cyber Tech Park, Phase II, HSR Layout, Bengaluru, Karnataka - 560102</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PAY PERIOD</span>
              <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>{monthYear}</p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginTop: '1rem',
            paddingTop: '0.875rem',
            borderTop: '1px dashed var(--border-color)',
            fontSize: '0.825rem'
          }}>
            <div>
              <p><strong>Employee Name:</strong> {salaryData.employeeName}</p>
              <p><strong>Employee ID:</strong> {salaryData.employeeId}</p>
              <p><strong>Designation:</strong> {salaryData.designation}</p>
              <p><strong>Department:</strong> {salaryData.department}</p>
            </div>
            <div>
              <p><strong>Bank Account:</strong> {salaryData.bankAccountNumber}</p>
              <p><strong>IFSC Code:</strong> {salaryData.ifscNumber}</p>
              <p><strong>PAN Number:</strong> {salaryData.panNumber}</p>
              <p><strong>Payment Status:</strong> <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Disbursed</span></p>
            </div>
          </div>
        </div>

        {/* Breakdown Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Earnings */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>EARNINGS</th>
                  <th style={{ textAlign: 'right' }}>AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Pay</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{salaryData.basicPay?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>House Rent Allowance (HRA)</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{salaryData.hra?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Special Allowance</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{salaryData.specialAllowance?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Performance Bonus</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{salaryData.performanceBonus?.toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                  <td><strong>GROSS EARNINGS</strong></td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--accent-emerald)' }}>₹{salaryData.grossSalary?.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>DEDUCTIONS</th>
                  <th style={{ textAlign: 'right' }}>AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Provident Fund (PF)</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{salaryData.providentFund?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Professional Tax (PT)</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{salaryData.professionalTax?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Tax Deducted at Source (TDS)</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{salaryData.tds?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style={{ opacity: 0 }}>-</td>
                  <td style={{ opacity: 0 }}>-</td>
                </tr>
                <tr style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)' }}>
                  <td><strong>TOTAL DEDUCTIONS</strong></td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--accent-rose)' }}>₹{salaryData.totalDeductions?.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Salary Summary */}
        <div style={{
          backgroundColor: 'var(--primary-600)',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', opacity: 0.9, letterSpacing: '0.05em' }}>NET TAKE HOME SALARY</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              ₹{salaryData.netSalary?.toLocaleString('en-IN')} INR
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', opacity: 0.85 }}>
            <p>System Generated Document</p>
            <p>Dayflow HRMS • Confidential</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;
