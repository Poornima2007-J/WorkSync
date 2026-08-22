import React, { useState } from 'react';
import { X, User, Briefcase, CreditCard, FileText, Camera, Check, ShieldCheck } from 'lucide-react';
import UserAvatar from './UserAvatar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileViewModal = ({ employee, onClose, onProfileUpdated }) => {
  const { updateUserProfile, user: currentUser } = useAuth();
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState(employee?.avatarUrl || '');
  const [updating, setUpdating] = useState(false);

  if (!employee) return null;

  const isSelf = currentUser?.userId === employee.userId || currentUser?.email === employee.email;

  const handleSaveAvatar = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await api.put(`/employee/profile/${employee.userId}`, {
        firstName: employee.firstName,
        lastName: employee.lastName,
        phone: employee.phone,
        address: employee.address,
        avatarUrl: avatarUrlInput,
        emergencyContact: employee.emergencyContact,
        bloodGroup: employee.bloodGroup
      });
      
      employee.avatarUrl = avatarUrlInput;
      if (isSelf) {
        updateUserProfile({ avatarUrl: avatarUrlInput });
      }
      alert('Profile picture updated successfully!');
      setEditingAvatar(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile picture.');
    } finally {
      setUpdating(false);
    }
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Executive'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ position: 'relative' }}>
              <UserAvatar src={employee.avatarUrl} name={`${employee.firstName} ${employee.lastName}`} size={54} />
              <button
                onClick={() => setEditingAvatar(!editingAvatar)}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  border: '2px solid var(--bg-card)',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Change Profile Picture"
              >
                <Camera size={12} />
              </button>
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{employee.firstName} {employee.lastName}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {employee.designation} • {employee.department} ({employee.employeeId})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Change Profile Picture Sub-Drawer */}
        {editingAvatar && (
          <form onSubmit={handleSaveAvatar} style={{
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                Change Profile Picture URL
              </label>
              <button
                type="button"
                onClick={() => setAvatarUrlInput('')}
                style={{ fontSize: '0.725rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Reset to Neutral Placeholder
              </button>
            </div>

            <input
              type="text"
              className="form-input"
              placeholder="Paste Image URL (or select preset below)"
              value={avatarUrlInput}
              onChange={(e) => setAvatarUrlInput(e.target.value)}
              style={{ fontSize: '0.825rem' }}
            />

            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Or Choose Sample Avatar Preset:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {presetAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preset ${idx}`}
                    onClick={() => setAvatarUrlInput(url)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: avatarUrlInput === url ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                      objectFit: 'cover'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button type="button" onClick={() => setEditingAvatar(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }} disabled={updating}>
                <Check size={14} /> Update Picture
              </button>
            </div>
          </form>
        )}

        {/* Profile Content Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Personal Information */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-600)', fontWeight: 800, fontSize: '0.9rem' }}>
              <User size={16} /> Personal Information
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Email:</strong> {employee.email}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Phone:</strong> {employee.phone || '+91 98000 00000'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Blood Group:</strong> {employee.bloodGroup || 'O+'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Emergency Contact:</strong> {employee.emergencyContact || '+91 98765 00000'}</div>
              <div style={{ gridColumn: 'span 2' }}><strong style={{ color: 'var(--text-muted)' }}>Address:</strong> {employee.address || 'Bengaluru, Karnataka'}</div>
            </div>
          </div>

          {/* Job & Work Details */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-600)', fontWeight: 800, fontSize: '0.9rem' }}>
              <Briefcase size={16} /> Job & Deployment Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Employee ID:</strong> {employee.employeeId}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Department:</strong> {employee.department}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Designation:</strong> {employee.designation}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Date of Joining:</strong> {new Date(employee.dateOfJoining || Date.now()).toLocaleDateString('en-IN')}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Role Privileges:</strong> {employee.role === 1 || employee.role === 'HR' ? 'HR Admin Officer' : 'Regular Employee'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Account Status:</strong> <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Active</span></div>
            </div>
          </div>

          {/* Banking & Tax Details */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-600)', fontWeight: 800, fontSize: '0.9rem' }}>
              <CreditCard size={16} /> Banking & Tax (PAN/IFSC)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Bank Account No:</strong> {employee.bankAccountNumber || '918237465012'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>IFSC Code:</strong> {employee.ifscNumber || 'HDFC0001234'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>PAN Card Number:</strong> {employee.panNumber || 'ABCDE1234F'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>PF UAN Status:</strong> Active</div>
            </div>
          </div>

          {/* Verified Documents */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-600)', fontWeight: 800, fontSize: '0.9rem' }}>
              <FileText size={16} /> Employee Documents & Verification
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-approved" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                <ShieldCheck size={14} /> Aadhaar Card (Verified)
              </span>
              <span className="badge badge-approved" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                <ShieldCheck size={14} /> PAN Card (Verified)
              </span>
              <span className="badge badge-approved" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                <ShieldCheck size={14} /> Offer & Appointment Letter
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
          <button onClick={() => setEditingAvatar(!editingAvatar)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            <Camera size={14} /> {editingAvatar ? 'Close Picture Editor' : 'Change Profile Picture'}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewModal;
