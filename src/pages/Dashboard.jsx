import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div style={{ ...styles.statIcon, background: color + '18' }}>{icon}</div>
    <div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate  = useNavigate();
  const user      = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  const [stats, setStats]     = useState({ bookings: 0, reviews: 0, destinations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/bookings/my').catch(() => ({ data: { data: [] } })),
      API.get('/reviews/my').catch(() => ({ data: { data: [] } })),
      API.get('/destinations').catch(() => ({ data: { data: [] } })),
    ]).then(([b, r, d]) => {
      setStats({
        bookings:     (b.data.data || []).length,
        reviews:      (r.data.data || []).length,
        destinations: (d.data.data || []).length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.greeting}>
            Welcome back, {user?.name?.split(' ')[0] || 'Traveller'} 👋
          </h1>
          <p style={styles.subGreeting}>Here's what's happening with your account</p>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div style={styles.skeletonRow}>
          {[1,2,3].map(i => <div key={i} style={styles.skeletonCard} />)}
        </div>
      ) : (
        <div style={styles.statsRow}>
          <StatCard icon="🧳" label="My Bookings"    value={stats.bookings}     color="#e94560" />
          <StatCard icon="⭐" label="My Reviews"     value={stats.reviews}      color="#f59e0b" />
          <StatCard icon="🗺️" label="Destinations"   value={stats.destinations} color="#3b82f6" />
        </div>
      )}

      {/* Quick actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {[
            { icon: '🌍', label: 'Explore Destinations', path: '/destinations', color: '#3b82f6' },
            { icon: '🧳', label: 'My Bookings',          path: '/my-bookings',  color: '#e94560' },
            { icon: '⭐', label: 'My Reviews',           path: '/my-reviews',   color: '#f59e0b' },
            { icon: '👤', label: 'My Profile',           path: '/profile',      color: '#22c55e' },
          ].map(a => (
            <button key={a.path} style={styles.actionCard} onClick={() => navigate(a.path)}>
              <div style={{ ...styles.actionIcon, background: a.color + '18', color: a.color }}>
                {a.icon}
              </div>
              <span style={styles.actionLabel}>{a.label}</span>
              <span style={styles.actionArrow}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page:          { minHeight: '100vh', background: '#f4f6fa', padding: '40px', fontFamily: "'DM Sans', sans-serif" },
  header:        { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '14px' },
  greeting:      { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', margin: 0, fontFamily: "'Sora', sans-serif" },
  subGreeting:   { fontSize: '14px', color: '#6b7280', marginTop: '6px' },
  logoutBtn:     { background: '#fff', color: '#e94560', border: '1.5px solid #fecaca', padding: '10px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  statsRow:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' },
  statCard:      { background: '#fff', borderRadius: '14px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  statIcon:      { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
  statValue:     { fontSize: '26px', fontWeight: '700', color: '#1a1a2e', fontFamily: "'Sora', sans-serif" },
  statLabel:     { fontSize: '13px', color: '#6b7280', marginTop: '2px' },
  skeletonRow:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' },
  skeletonCard:  { height: '96px', borderRadius: '14px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' },
  section:       {},
  sectionTitle:  { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', fontFamily: "'Sora', sans-serif" },
  actionsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' },
  actionCard:    { background: '#fff', border: '1.5px solid #e8eaf0', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.18s, border-color 0.18s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  actionIcon:    { width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
  actionLabel:   { flex: 1, fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  actionArrow:   { fontSize: '16px', color: '#b0b7c3' },
};

export default Dashboard;