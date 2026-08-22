import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LeaveModal from '../components/LeaveModal';
import { CalendarDays, PlusCircle, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

const LeavePage = () => {
  const { isHR } = useAuth();
  const [balance, setBalance] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [activeTab, setActiveTab] = useState(isHR ? 'approval-desk' : 'my-leaves');
  const [statusFilter, setStatusFilter] = useState('All');

  // Review state
  const [reviewingId, setReviewingId] = useState(null);
  const [comment, setComment] = useState('');

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [balRes, myRes] = await Promise.all([
        api.get('/leave/balance'),
        api.get('/leave/my-requests')
      ]);
      setBalance(balRes.data);
      setMyRequests(myRes.data);

      if (isHR) {
        const allRes = await api.get('/leave/all');
        setAllRequests(allRes.data);
      }
    } catch (err) {
      console.error('Error loading leave data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [isHR]);

  const handleReview = async (leaveId, status) => {
    try {
      await api.put(`/leave/review/${leaveId}`, {
        status, // 1: Approved, 2: Rejected
        adminComment: comment || (status === 1 ? 'Approved by HR' : 'Rejected by HR')
      });
      alert(`Leave request ${status === 1 ? 'Approved' : 'Rejected'} successfully!`);
      setReviewingId(null);
      setComment('');
      fetchLeaveData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const getLeaveTypeName = (type) => {
    switch (type) {
      case 0: return 'Paid Leave (PL)';
      case 1: return 'Sick Leave (SL)';
      case 2: return 'Unpaid Leave (LWP)';
      case 3: return 'Casual Leave (CL)';
      default: return 'Leave';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 1 || status === 'Approved') return <span className="badge badge-approved">Approved</span>;
    if (status === 2 || status === 'Rejected') return <span className="badge badge-rejected">Rejected</span>;
    return <span className="badge badge-pending">Pending Review</span>;
  };

  const filteredAllRequests = allRequests.filter((req) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return req.status === 0 || req.status === 'Pending';
    if (statusFilter === 'Approved') return req.status === 1 || req.status === 'Approved';
    if (statusFilter === 'Rejected') return req.status === 2 || req.status === 'Rejected';
    return true;
  });

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarDays size={24} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Leave & Time-Off Management</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track leave balances, submit vacation requests, and manage approval workflows.
          </p>
        </div>

        <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Apply for Leave
        </button>
      </div>

      {/* Leave Balance Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PAID LEAVE (PL)</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{balance?.paidLeaveRemaining ?? 15} Days</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>15 Days Yearly Quota</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SICK LEAVE (SL)</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{balance?.sickLeaveRemaining ?? 12} Days</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>12 Days Yearly Quota</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CASUAL LEAVE (CL)</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{balance?.casualLeaveRemaining ?? 10} Days</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10 Days Yearly Quota</span>
        </div>
      </div>

      {/* Tabs */}
      {isHR && (
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('my-leaves')}
            className={`btn ${activeTab === 'my-leaves' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            My Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('approval-desk')}
            className={`btn ${activeTab === 'approval-desk' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            HR Approval Desk ({allRequests.filter(r => r.status === 0 || r.status === 'Pending').length} Pending)
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            {activeTab === 'my-leaves' ? 'My Leave Applications History' : 'HR Leave Approvals Desk'}
          </h3>

          {activeTab === 'approval-desk' && (
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px', padding: '0.35rem 0.5rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="Approved">Approved Only</option>
              <option value="Rejected">Rejected Only</option>
            </select>
          )}
        </div>

        {loading ? (
          <div>Loading leave requests...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {activeTab === 'approval-desk' && <th>EMPLOYEE</th>}
                  <th>TYPE</th>
                  <th>DATES</th>
                  <th>DAYS</th>
                  <th>REASON</th>
                  <th>STATUS</th>
                  <th>HR COMMENTS</th>
                  {activeTab === 'approval-desk' && <th style={{ textAlign: 'center' }}>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'my-leaves' ? myRequests : filteredAllRequests).map((req) => (
                  <tr key={req.id}>
                    {activeTab === 'approval-desk' && (
                      <td>
                        <strong>{req.employeeName}</strong>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{req.employeeId} • {req.department}</span>
                      </td>
                    )}
                    <td>
                      <span className="badge badge-info">{getLeaveTypeName(req.leaveType)}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {new Date(req.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(req.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                    <td><strong>{req.daysCount} Day(s)</strong></td>
                    <td style={{ maxWidth: '240px', fontSize: '0.825rem' }}>{req.reason}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.adminComment || '—'}</td>

                    {activeTab === 'approval-desk' && (
                      <td style={{ textAlign: 'center' }}>
                        {reviewingId === req.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '220px' }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              style={{ fontSize: '0.75rem', padding: '0.35rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                              <button onClick={() => handleReview(req.id, 1)} className="btn btn-success" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                                Approve
                              </button>
                              <button onClick={() => handleReview(req.id, 2)} className="btn btn-danger" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                                Reject
                              </button>
                              <button onClick={() => setReviewingId(null)} className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setReviewingId(req.id)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                            Review
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showApplyModal && (
        <LeaveModal
          onClose={() => setShowApplyModal(false)}
          onSuccess={fetchLeaveData}
        />
      )}
    </div>
  );
};

export default LeavePage;
