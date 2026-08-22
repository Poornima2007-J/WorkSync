import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PayslipModal from '../components/PayslipModal';
import { IndianRupee, Printer, Edit2, Shield, FileText, CheckCircle2, X } from 'lucide-react';

const PayrollPage = () => {
  const { isHR } = useAuth();
  const [mySalary, setMySalary] = useState(null);
  const [allPayroll, setAllPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedSalaryForSlip, setSelectedSalaryForSlip] = useState(null);

  // Edit salary state
  const [editingUserId, setEditingUserId] = useState(null);
  const [salaryForm, setSalaryForm] = useState({
    basicPay: 40000,
    hra: 20000,
    specialAllowance: 15000,
    performanceBonus: 5000,
    providentFund: 4800,
    professionalTax: 200,
    tds: 3000
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const myRes = await api.get('/payroll/my-salary');
      setMySalary(myRes.data);

      if (isHR) {
        const allRes = await api.get('/payroll/all');
        setAllPayroll(allRes.data);
      }
    } catch (err) {
      console.error('Error fetching payroll data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isHR]);

  const handleOpenEdit = (item) => {
    setEditingUserId(item.userId);
    setSalaryForm({
      basicPay: item.basicPay,
      hra: item.hra,
      specialAllowance: item.specialAllowance,
      performanceBonus: item.performanceBonus,
      providentFund: item.providentFund,
      professionalTax: item.professionalTax,
      tds: item.tds
    });
  };

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/payroll/update/${editingUserId}`, salaryForm);
      alert('Salary structure updated successfully!');
      setEditingUserId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update salary structure.');
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={24} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Payroll & Salary Structure</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Indian statutory compliance (PF, HRA, TDS breakups), gross pay, net pay, and printable pay slips.
          </p>
        </div>

        {mySalary && (
          <button
            onClick={() => {
              setSelectedSalaryForSlip(mySalary);
              setShowPayslip(true);
            }}
            className="btn btn-primary"
          >
            <Printer size={18} /> View & Print My Payslip
          </button>
        )}
      </div>

      {/* Salary Overview Card for Employee */}
      {mySalary && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04), rgba(16, 185, 129, 0.04))',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>My Salary Structure ({mySalary.currency})</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Designation: {mySalary.designation} • Bank: {mySalary.bankAccountNumber}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>NET MONTHLY PAY</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                ₹{mySalary.netSalary?.toLocaleString('en-IN')}
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>BASIC PAY</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem' }}>₹{mySalary.basicPay?.toLocaleString('en-IN')}</p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>HRA</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem' }}>₹{mySalary.hra?.toLocaleString('en-IN')}</p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>SPECIAL ALLOWANCE</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem' }}>₹{mySalary.specialAllowance?.toLocaleString('en-IN')}</p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>PROVIDENT FUND (PF)</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '0.2rem' }}>-₹{mySalary.providentFund?.toLocaleString('en-IN')}</p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>TAX (TDS)</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '0.2rem' }}>-₹{mySalary.tds?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Payroll Master Table */}
      {isHR && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Company Payroll Master Desk</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View and update salary structures for all company employees</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>BASIC PAY</th>
                  <th>HRA</th>
                  <th>ALLOWANCE</th>
                  <th>GROSS PAY</th>
                  <th>DEDUCTIONS (PF+TDS)</th>
                  <th>NET PAYABLE</th>
                  <th style={{ textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {allPayroll.map((item) => (
                  <tr key={item.userId}>
                    <td>
                      <strong>{item.employeeName}</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.employeeId} • {item.department}</span>
                    </td>
                    <td>₹{item.basicPay?.toLocaleString('en-IN')}</td>
                    <td>₹{item.hra?.toLocaleString('en-IN')}</td>
                    <td>₹{item.specialAllowance?.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>₹{item.grossSalary?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--accent-rose)' }}>-₹{item.totalDeductions?.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 800, fontSize: '0.95rem' }}>₹{item.netSalary?.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedSalaryForSlip(item);
                            setShowPayslip(true);
                          }}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                          title="Generate Slip"
                        >
                          <FileText size={14} /> Slip
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                          title="Edit Structure"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Salary Modal */}
      {editingUserId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Update Salary Structure</h3>
              <button onClick={() => setEditingUserId(null)} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSalary} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Basic Pay (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryForm.basicPay}
                    onChange={(e) => setSalaryForm({ ...salaryForm, basicPay: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>HRA (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryForm.hra}
                    onChange={(e) => setSalaryForm({ ...salaryForm, hra: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Special Allowance (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryForm.specialAllowance}
                    onChange={(e) => setSalaryForm({ ...salaryForm, specialAllowance: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Performance Bonus (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryForm.performanceBonus}
                    onChange={(e) => setSalaryForm({ ...salaryForm, performanceBonus: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Provident Fund (PF ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryForm.providentFund}
                    onChange={(e) => setSalaryForm({ ...salaryForm, providentFund: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Prof. Tax (PT ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryForm.professionalTax}
                    onChange={(e) => setSalaryForm({ ...salaryForm, professionalTax: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>TDS Tax (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryForm.tds}
                    onChange={(e) => setSalaryForm({ ...salaryForm, tds: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingUserId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Salary Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {showPayslip && (
        <PayslipModal
          salaryData={selectedSalaryForSlip}
          onClose={() => setShowPayslip(false)}
        />
      )}
    </div>
  );
};

export default PayrollPage;
