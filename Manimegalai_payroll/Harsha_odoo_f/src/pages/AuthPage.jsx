import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  Lock,
  Mail,
  IdCard,
  Sparkles,
  CheckCircle2,
  Building,
  ArrowRight,
  UserPlus
} from 'lucide-react';

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [role, setRole] = useState(0); // 0: Employee, 1: HR

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          employeeId: employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
          email,
          password,
          firstName,
          lastName,
          department,
          designation,
          role: parseInt(role)
        });
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignUpToggle = () => {
    setIsRegister(true);
    setRole(1); // HR / Admin Officer
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-app)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      {/* Website Top Header Bar */}
      <header style={{
        height: '72px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 3rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '1.3rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}>
            D
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>Dayflow</span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>HRMS Enterprise</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Every workday, perfectly aligned.</p>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            Sign In
          </button>
          <button
            onClick={handleAdminSignUpToggle}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            <UserPlus size={14} /> Admin / HR Sign Up
          </button>
        </nav>
      </header>

      {/* Main Hero & Professional Login Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '3rem',
        padding: '4rem 4rem 2rem 4rem',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        alignItems: 'center'
      }}>
        {/* Left Hero Brand Value Proposition */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--primary-600)',
            fontSize: '0.825rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            border: '1px solid rgba(37, 99, 235, 0.2)'
          }}>
            <Sparkles size={16} /> Enterprise HR & Payroll Management System
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, var(--text-main) 40%, var(--primary-600))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Every workday, <br />
            perfectly aligned.
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '2.5rem'
          }}>
            Streamline employee profiles, real-time attendance check-ins, multi-level leave approval workflows, Indian statutory salary slips (₹), and AI workday pulse check in one unified enterprise portal.
          </p>

          {/* Key Feature Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle2 color="#10b981" size={20} /> Real-Time Check-In & Attendance Tracker
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle2 color="#10b981" size={20} /> Multi-Level HR Leave Approval Workflow Desk
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle2 color="#10b981" size={20} /> Printable Salary Slips with PF, PT & Tax Breakdowns (₹ INR)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle2 color="#10b981" size={20} /> AI Workday Mood & Burnout Prevention Analytics
            </div>
          </div>

          {/* Social Proof Counter */}
          <div style={{ display: 'flex', gap: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>500+</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprises Onboarded</p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>99.9%</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance Accuracy</p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹500Cr+</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Payroll Processed</p>
            </div>
          </div>
        </div>

        {/* Right Clean Professional Login / Register Portal */}
        <div id="portal" className="card" style={{
          padding: '2.75rem 2.5rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)'
        }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>
              {isRegister ? (role === 1 ? 'ADMIN REGISTRATION' : 'EMPLOYEE REGISTRATION') : 'SECURE PORTAL ACCESS'}
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
              {isRegister ? (role === 1 ? 'Register as HR Admin Officer' : 'Register Employee Account') : 'Sign In to Dayflow'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {isRegister ? 'Complete your information to create an account' : 'Enter your work email and password to log in'}
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid var(--accent-rose)',
              color: 'var(--accent-rose)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {isRegister && (
              <>
                <div className="form-group">
                  <label><IdCard size={12} /> Employee / Admin ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. HR-001 or EMP-105"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      className="form-input"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Human Resources">Human Resources</option>
                      <option value="Engineering">Engineering</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Product Operations">Product Operations</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account Role</label>
                    <select
                      className="form-input"
                      value={role}
                      onChange={(e) => setRole(parseInt(e.target.value))}
                    >
                      <option value={1}>HR / Admin Officer</option>
                      <option value={0}>Employee</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label><Mail size={12} /> Work Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@company.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label><Lock size={12} /> Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : (isRegister ? (role === 1 ? 'Register HR Admin Account' : 'Register Employee Account') : 'Sign In to Portal')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {isRegister ? 'Already have an account?' : 'Need an account?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-600)',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isRegister ? 'Sign In' : 'Register Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Website Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        padding: '2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '0.75rem',
        width: '100%',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          © 2026 Dayflow HRMS Technologies Pvt. Ltd. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Security & Compliance</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
