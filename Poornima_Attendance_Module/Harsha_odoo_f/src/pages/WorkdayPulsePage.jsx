import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Sparkles, Activity, AlertTriangle, CheckCircle2, HeartPulse, RefreshCw } from 'lucide-react';

const WorkdayPulsePage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/aipulse/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching pulse analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.75rem 2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={24} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>AI Workday Pulse & Burnout Risk Radar</h1>
            <span className="badge badge-info" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>HACKATHON INNOVATION</span>
          </div>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
            Intelligent daily sentiment monitoring, employee energy tracking, and proactive burnout prevention algorithms.
          </p>
        </div>

        <button onClick={fetchAnalytics} className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
          <RefreshCw size={16} /> Refresh Analytics
        </button>
      </div>

      {loading ? (
        <div className="card">Analyzing team pulse data...</div>
      ) : (
        <>
          {/* Risk & Energy Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #6366f1' }}>
              <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                <HeartPulse size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>AVERAGE TEAM ENERGY</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{analytics?.averageEnergy} / 10</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Optimal Work Rhythm</span>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${analytics?.burnoutRiskLevel === 'High' ? '#f43f5e' : analytics?.burnoutRiskLevel === 'Moderate' ? '#f59e0b' : '#10b981'}` }}>
              <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)' }}>
                <Activity size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>BURNOUT RISK LEVEL</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: analytics?.burnoutRiskLevel === 'High' ? 'var(--accent-rose)' : analytics?.burnoutRiskLevel === 'Moderate' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                  {analytics?.burnoutRiskLevel}
                </h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Based on recent check-ins</span>
              </div>
            </div>
          </div>

          {/* AI Recommendations Box */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(37, 99, 235, 0.04))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={20} color="#6366f1" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Smart HR Recommendations</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics?.aiRecommendations?.map((rec, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-card)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                  <CheckCircle2 color="#10b981" size={18} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Check-In Feed */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Recent Workday Sentiment Check-Ins
            </h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>MOOD</th>
                    <th>ENERGY SCORE</th>
                    <th>DATE & TIME</th>
                    <th>EMPLOYEE NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.recentEntries?.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <strong>{e.employeeName}</strong>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{e.department}</span>
                      </td>
                      <td>
                        <span className="badge badge-info">{e.mood}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', width: '80px', overflow: 'hidden' }}>
                            <div style={{ width: `${e.energyScore * 10}%`, height: '100%', backgroundColor: e.energyScore >= 7 ? '#10b981' : e.energyScore >= 5 ? '#f59e0b' : '#f43f5e' }} />
                          </div>
                          <span style={{ fontWeight: 700 }}>{e.energyScore}/10</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{e.remarks || 'Standard workday check-in'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkdayPulsePage;
