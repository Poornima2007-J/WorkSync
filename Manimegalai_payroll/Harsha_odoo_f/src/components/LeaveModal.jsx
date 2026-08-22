import React, { useState } from 'react';
import api from '../services/api';
import { X, Calendar, FileText, Send } from 'lucide-react';

const LeaveModal = ({ onClose, onSuccess }) => {
  const [leaveType, setLeaveType] = useState(0); // 0: Paid, 1: Sick, 2: Unpaid, 3: Casual
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please state a reason for your leave application.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/leave/apply', {
        leaveType: parseInt(leaveType),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason
      });
      alert('Leave application submitted successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit leave request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Apply for Time-Off / Leave</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Leave Category</label>
            <select
              className="form-input"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value={0}>Paid Leave (PL / Privilege Leave)</option>
              <option value={1}>Sick Leave (SL / Medical)</option>
              <option value={3}>Casual Leave (CL / Festive)</option>
              <option value={2}>Unpaid Leave (LWP)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem',
            fontSize: '0.85rem',
            color: 'var(--primary-700)',
            fontWeight: 600
          }}>
            Total Duration: {calculateDays()} Day(s)
          </div>

          <div className="form-group">
            <label>Reason / Remarks</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Attending family function in hometown..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} /> Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveModal;
