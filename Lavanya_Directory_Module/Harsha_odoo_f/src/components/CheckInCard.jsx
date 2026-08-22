import React, { useState, useEffect } from 'react';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { Clock, MapPin, Smile, CheckCircle, LogOut, Zap } from 'lucide-react';

const CheckInCard = ({ onStatusChange }) => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Office');
  const [remarks, setRemarks] = useState('');
  const [selectedMood, setSelectedMood] = useState('Good');
  const [energyScore, setEnergyScore] = useState(8);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const res = await api.get('/attendance/today');
      setTodayStatus(res.data);
    } catch (err) {
      console.error('Error fetching attendance status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await api.post('/attendance/check-in', {
        location,
        remarks,
        mood: selectedMood,
        energyScore: parseInt(energyScore)
      });
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      await fetchTodayStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await api.post('/attendance/check-out', { remarks });
      await fetchTodayStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !todayStatus) {
    return <div className="card">Loading attendance widget...</div>;
  }

  const moods = [
    { label: 'Great', emoji: '😃', score: 10 },
    { label: 'Good', emoji: '😊', score: 8 },
    { label: 'Neutral', emoji: '😐', score: 6 },
    { label: 'Stressed', emoji: '😓', score: 4 },
    { label: 'Exhausted', emoji: '😫', score: 2 }
  ];

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(99, 102, 241, 0.05))',
      border: '1px solid rgba(37, 99, 235, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Workday Punch Counter</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          fontFamily: 'monospace',
          color: 'var(--primary-600)',
          backgroundColor: 'var(--bg-card)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {currentTime.toLocaleTimeString('en-IN')}
        </div>
      </div>

      {todayStatus?.isCheckedIn ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <span className="badge badge-present" style={{ marginBottom: '0.5rem' }}>
                <CheckCircle size={12} /> {todayStatus.isCheckedOut ? 'Shift Completed' : 'Session Active'}
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Checked in at: <strong>{new Date(todayStatus.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> ({todayStatus.location})
              </p>
              {todayStatus.checkOutTime && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Checked out at: <strong>{new Date(todayStatus.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> (Hours: {todayStatus.workingHours} hrs)
                </p>
              )}
            </div>

            {!todayStatus.isCheckedOut && (
              <button onClick={handleCheckOut} className="btn btn-danger" disabled={loading}>
                <LogOut size={16} /> Check Out Now
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Location & Remarks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label><MapPin size={12} /> Work Location</label>
              <select
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Office">Corporate Office (In-Person)</option>
                <option value="Remote">Remote (Work From Home)</option>
                <option value="Client Site">Client Site Visit</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Work Note / Remarks</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Working on Q3 HRMS Release"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          {/* AI Mood Check-in Pill */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              <Zap size={14} color="#f59e0b" style={{ display: 'inline', marginRight: '4px' }} />
              How are you feeling today? (Workday Sentiment Pulse)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {moods.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => {
                    setSelectedMood(m.label);
                    setEnergyScore(m.score);
                  }}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedMood === m.label ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                    backgroundColor: selectedMood === m.label ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontWeight: selectedMood === m.label ? '700' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCheckIn} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
            <CheckCircle size={18} /> Confirm Workday Check-In
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckInCard;
