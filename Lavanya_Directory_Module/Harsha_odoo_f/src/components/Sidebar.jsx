import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  IndianRupee,
  Users,
  Sparkles,
  UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { isHR } = useAuth();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/attendance',
      label: 'Attendance',
      icon: CalendarCheck
    },
    {
      path: '/leaves',
      label: 'Leave Desk',
      icon: CalendarDays
    },
    {
      path: '/payroll',
      label: 'Payroll & Payslips',
      icon: IndianRupee
    },
    ...(isHR ? [
      {
        path: '/directory',
        label: 'Employee Directory',
        icon: Users
      }
    ] : []),
    {
      path: '/ai-pulse',
      label: 'AI Workday Pulse',
      icon: Sparkles,
      badge: 'NEW'
    }
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 68px)',
      position: 'sticky',
      top: '68px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
          padding: '0 0.75rem 0.5rem 0.75rem',
          textTransform: 'uppercase'
        }}>
          Navigation Menu
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                backgroundColor: isActive ? 'var(--primary-600)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: '800',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#6366f1'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer info widget */}
      <div className="card" style={{ padding: '1rem', background: 'rgba(37, 99, 235, 0.04)', border: '1px border-color' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <UserCheck size={16} color="#10b981" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>System Live</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Connected to Dayflow API v1.0. All workday syncs active.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
