import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CheckInCard from '../components/CheckInCard';
import { CalendarCheck, Clock, MapPin, CheckCircle, AlertCircle, Calendar, List, Grid } from 'lucide-react';

const AttendancePage = () => {
  const { isHR } = useAuth();
  const [viewMode, setViewMode] = useState(isHR ? 'company' : 'personal');
  const [timeRange, setTimeRange] = useState('daily'); // 'daily' or 'weekly'
  const [personalLogs, setPersonalLogs] = useState([]);
  const [companyLogs, setCompanyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchPersonalLogs = async () => {
    try {
      const res = await api.get('/attendance/my-history');
      setPersonalLogs(res.data);
    } catch (err) {
      console.error('Error fetching personal attendance:', err);
    }
  };

  const fetchCompanyLogs = async () => {
    try {
      const res = await api.get(`/attendance/all?date=${selectedDate}`);
      setCompanyLogs(res.data);
    } catch (err) {
      console.error('Error fetching company attendance:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (viewMode === 'personal') {
      fetchPersonalLogs().finally(() => setLoading(false));
    } else {
      fetchCompanyLogs().finally(() => setLoading(false));
    }
  }, [viewMode, selectedDate]);

  // Filter logs for Daily (last 7 days) vs Weekly (last 30 days)
  const displayedPersonalLogs = timeRange === 'daily' ? personalLogs.slice(0, 7) : personalLogs;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck size={24} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Attendance & Shifts Tracking</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Daily check-in logs, total working hours, shift history, location, and attendance status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* Daily / Weekly View Switcher */}
          {viewMode === 'personal' && (
            <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setTimeRange('daily')}
                className={`btn ${timeRange === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                Daily View
              </button>
              <button
                onClick={() => setTimeRange('weekly')}
                className={`btn ${timeRange === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                Weekly View
              </button>
            </div>
          )}

          {isHR && (
            <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setViewMode('personal')}
                className={`btn ${viewMode === 'personal' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                My Attendance
              </button>
              <button
                onClick={() => setViewMode('company')}
                className={`btn ${viewMode === 'company' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                Company Attendance Master
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CheckIn Punch Widget matching Wireframe Row 3 */}
      {viewMode === 'personal' && <CheckInCard onStatusChange={fetchPersonalLogs} />}

      {/* View Content Table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            {viewMode === 'personal' ? (timeRange === 'daily' ? 'Recent 7-Day Attendance Logs' : '30-Day Complete Attendance History') : `Company Attendance Master for ${selectedDate}`}
          </h3>

          {viewMode === 'company' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Select Date:</label>
              <input
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '160px', padding: '0.35rem 0.5rem' }}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div>Loading attendance records...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {viewMode === 'company' && <th>EMPLOYEE</th>}
                  <th>DATE</th>
                  <th>CHECK-IN</th>
                  <th>CHECK-OUT</th>
                  <th>WORKING HOURS</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {(viewMode === 'personal' ? displayedPersonalLogs : companyLogs).map((log, i) => (
                  <tr key={i}>
                    {viewMode === 'company' && (
                      <td>
                        <strong>{log.employeeName}</strong>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.employeeId} • {log.department}</span>
                      </td>
                    )}
                    <td>{new Date(log.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                    <td>{log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td>{log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td><strong>{log.workingHours ? `${log.workingHours} hrs` : '—'}</strong></td>
                    <td>{log.location || 'Office'}</td>
                    <td>
                      <span className={`badge ${log.status === 0 || log.status === 'Present' ? 'badge-present' : log.status === 2 || log.status === 'HalfDay' ? 'badge-pending' : log.status === 3 || log.status === 'OnLeave' ? 'badge-info' : 'badge-absent'}`}>
                        {log.status === 0 || log.status === 'Present' ? 'Present' : log.status === 2 || log.status === 'HalfDay' ? 'Half Day' : log.status === 3 || log.status === 'OnLeave' ? 'On Leave' : 'Absent'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.remarks || 'Normal'}</td>
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

export default AttendancePage;
