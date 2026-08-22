import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Shield, User, LogOut } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';
import UserAvatar from './UserAvatar';

const Navbar = () => {
  const { user, logout, isHR } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="glass-effect" style={{
      height: '68px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-header)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand Identification */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563eb, #6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: '800',
          fontSize: '1.2rem',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
        }}>
          D
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: '800', fontSize: '1.15rem', letterSpacing: '-0.02em' }}>Dayflow</span>
            <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>HRMS</span>
          </div>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Every workday, perfectly aligned.</p>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="btn btn-secondary"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-rose)',
            borderRadius: '50%'
          }} />
        </button>

        {/* User Info & Avatar */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>
            <UserAvatar src={user.avatarUrl} name={user.fullName} size={36} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.2 }}>{user.fullName}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {isHR ? <Shield size={10} color="#2563eb" /> : <User size={10} />}
                {user.role} ({user.employeeId})
              </span>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Notification Drawer */}
      {showNotifications && <NotificationDrawer onClose={() => setShowNotifications(false)} />}
    </header>
  );
};

export default Navbar;
