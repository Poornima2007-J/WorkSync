import React from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Info, Calendar } from 'lucide-react';

const NotificationDrawer = ({ onClose }) => {
  const notifications = [
    {
      id: 1,
      title: 'Leave Approved',
      desc: 'Your Sick Leave request for 2 days has been approved by HR.',
      time: '10 mins ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Attendance Reminder',
      desc: 'Don\'t forget to punch your Check-In status for today\'s shift.',
      time: '1 hour ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'Payslip Available',
      desc: 'August 2026 Salary Slip is now generated and ready for viewing.',
      time: '1 day ago',
      type: 'success'
    },
    {
      id: 4,
      title: 'Townhall Announcement',
      desc: 'Quarterly Company All-Hands meeting scheduled for Friday 4:00 PM.',
      time: '2 days ago',
      type: 'alert'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: '68px',
      right: '2rem',
      width: '360px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 90,
      padding: '1.25rem',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="#2563eb" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Notification Center</h4>
        </div>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-app)',
            borderLeft: `4px solid ${n.type === 'success' ? '#10b981' : n.type === 'alert' ? '#f59e0b' : '#3b82f6'}`,
            fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '0.2rem' }}>
              <span>{n.title}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>{n.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDrawer;
