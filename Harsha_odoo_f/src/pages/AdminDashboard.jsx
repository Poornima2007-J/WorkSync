import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Users,
  UserCheck,
  CalendarDays,
  IndianRupee,
  CheckCircle,
  XCircle,
  MessageSquare,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [comment, setComment] = useState('');

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/dashboard/admin');
      setMetrics(res.data);
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleReview = async (leaveId, status) => {
    try {
      await api.put(`/leave/review/${leaveId}`, {
        status, // 1: Approved, 2: Rejected
        adminComment: comment || (status === 1 ? 'Approved by HR' : 'Rejected by HR')
      });
      alert(`Leave request ${status === 1 ? 'Approved' : 'Rejected'} successfully.`);
      setReviewingId(null);
      setComment('');
      fetchMetrics();
    } catch (err) {
      alert(err.response?.data?.message || 'Review action failed');
    }
  };

  if (loading) {
    return <div className="page-wrapper">Loading HR Command Center...</div>;
  }

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1d4ed8, #4338ca)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.75rem 2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={24} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>HR Admin Command Center</h1>
          </div>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
            Real-time workforce monitoring, leave approvals desk, and payroll management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/directory" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: '#1d4ed8' }}>
            <Users size={16} /> Employee Directory
          </Link>
          <Link to="/payroll" className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
            <IndianRupee size={16} /> Manage Payroll
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary-600)' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL EMPLOYEES</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{metrics?.totalEmployees} Active</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRESENT TODAY</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{metrics?.presentToday} On-Duty</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING LEAVE APPROVALS</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{metrics?.pendingLeavesCount} Requests</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>MONTHLY PAYROLL OUTFLOW</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{metrics?.totalMonthlyPayroll?.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Pending Leave Requests Desk */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Pending Leave Approvals Desk</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Review and approve employee leave requests in real-time</p>
          </div>
          <Link to="/leaves" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All Leave Logs <ArrowRight size={14} />
          </Link>
        </div>

        {metrics?.recentLeaveRequests?.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            🎉 All pending leave requests have been reviewed!
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>LEAVE TYPE</th>
                  <th>DURATION</th>
                  <th>REASON</th>
                  <th style={{ textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {metrics?.recentLeaveRequests?.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.employeeName}</strong>
                    </td>
                    <td>
                      <span className="badge badge-pending">{req.leaveType}</span>
                    </td>
                    <td>{req.daysCount} Day(s)</td>
                    <td style={{ maxWidth: '280px' }}>{req.reason}</td>
                    <td style={{ textAlign: 'center' }}>
                      {reviewingId === req.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '240px' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Add HR comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                          />
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                            <button onClick={() => handleReview(req.id, 1)} className="btn btn-success" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                              Approve
                            </button>
                            <button onClick={() => handleReview(req.id, 2)} className="btn btn-danger" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                              Reject
                            </button>
                            <button onClick={() => setReviewingId(null)} className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setReviewingId(req.id)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                          Review Request
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
