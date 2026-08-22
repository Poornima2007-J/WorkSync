import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CheckInCard from '../components/CheckInCard';
import LeaveModal from '../components/LeaveModal';
import PayslipModal from '../components/PayslipModal';
import UserAvatar from '../components/UserAvatar';
import {
  CalendarDays,
  IndianRupee,
  Flame,
  Clock,
  PlusCircle,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/employee');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching employee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalary = async () => {
    try {
      const res = await api.get('/payroll/my-salary');
      setSalaryDetails(res.data);
    } catch (err) {
      console.error('Error fetching salary details:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchSalary();
  }, []);

  if (loading) {
    return <div className="page-wrapper">Loading your workspace...</div>;
  }

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <UserAvatar src={user?.avatarUrl} name={data?.fullName || user?.fullName} size={64} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Namaste, {data?.fullName}!</h1>
              <span className="badge badge-info">{data?.department}</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {data?.designation} • Employee ID: <strong>{data?.employeeId}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowLeaveModal(true)} className="btn btn-primary">
            <PlusCircle size={18} /> Apply for Leave
          </button>
          <button onClick={() => setShowPayslipModal(true)} className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
            <FileText size={18} /> View Salary Slip
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PAID LEAVE BALANCE</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{data?.leaveBalance} Days</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)' }}>
            <Flame size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ATTENDANCE STREAK</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>5 Days Active</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary-600)' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATED NET SALARY</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{data?.netSalary?.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING REQUESTS</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{data?.pendingLeavesCount} Pending</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Check-In Card + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
        <CheckInCard onStatusChange={fetchDashboard} />

        {/* Activity & Alerts */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Recent Workday Activity</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700 }}>Live Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {data?.activityFeed?.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}>
                <div>
                  <p style={{ fontWeight: 700 }}>{item.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</p>
                </div>
                <span className="badge badge-present">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLeaveModal && (
        <LeaveModal
          onClose={() => setShowLeaveModal(false)}
          onSuccess={fetchDashboard}
        />
      )}

      {showPayslipModal && (
        <PayslipModal
          salaryData={salaryDetails}
          onClose={() => setShowPayslipModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
