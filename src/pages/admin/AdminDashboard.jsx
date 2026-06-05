import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/api';
import { formatPrice, formatNumber } from '../../lib/helpers';

const AdminDashboard = () => {
  const [stats, setStats]       = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/dashboard'),
      API.get('/bookings?limit=5'),
    ]).then(([s, b]) => {
      setStats(s.data.data);
      setBookings(b.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Users',        value: formatNumber(stats.totalUsers),        icon: '👥', color: '#1565c0', bg: '#e3f2fd' },
    { label: 'Total Bookings',     value: formatNumber(stats.totalBookings),     icon: '📋', color: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Total Revenue',      value: formatPrice(stats.totalRevenue),       icon: '💰', color: '#e94560', bg: '#fff5f7' },
    { label: 'Total Packages',     value: formatNumber(stats.totalPackages),     icon: '📦', color: '#f5a623', bg: '#fff8e1' },
    { label: 'Total Destinations', value: formatNumber(stats.totalDestinations), icon: '🌍', color: '#6a1b9a', bg: '#f3e5f5' },
  ] : [];

  const statusColors = { pending: '#f5a623', confirmed: '#2e7d32', cancelled: '#c62828', completed: '#1565c0' };

  return (
    <div style={styles.layout}>
      <AdminSidebar />
      <div style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>Dashboard</h1>
          <p style={styles.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {loading ? <p>Loading stats...</p> : (
          <>
            <div style={styles.statsGrid}>
              {statCards.map((c, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: c.bg, color: c.color }}>{c.icon}</div>
                  <div>
                    <p style={{ ...styles.statValue, color: c.color }}>{c.value}</p>
                    <p style={styles.statLabel}>{c.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Recent Bookings</h2>
              <div style={styles.table}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Booking ID</th>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Package</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} style={styles.tr}>
                        <td style={styles.td}>{b.bookingId}</td>
                        <td style={styles.td}>{b.user?.name}</td>
                        <td style={styles.td}>{b.package?.title}</td>
                        <td style={styles.td}>{formatPrice(b.totalPrice)}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: statusColors[b.status] }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f4f6fa' },
  main: { flex: 1, padding: '35px', overflowX: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  heading: { fontSize: '28px', color: '#1a1a2e', margin: 0 },
  date: { color: '#888', fontSize: '14px', margin: 0 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' },
  statCard: {
    background: '#fff', borderRadius: '14px', padding: '22px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', gap: '16px', alignItems: 'center'
  },
  statIcon: { width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 },
  statValue: { fontSize: '26px', fontWeight: 'bold', margin: 0 },
  statLabel: { fontSize: '13px', color: '#888', margin: '4px 0 0' },
  section: { background: '#fff', borderRadius: '14px', padding: '25px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  sectionTitle: { fontSize: '20px', color: '#1a1a2e', margin: '0 0 20px' },
  table: { overflowX: 'auto' },
  thead: { background: '#f8f9fa' },
  th: { padding: '12px 15px', textAlign: 'left', fontSize: '13px', color: '#555', fontWeight: '600', borderBottom: '2px solid #f0f0f0' },
  tr: { borderBottom: '1px solid #f8f8f8' },
  td: { padding: '13px 15px', fontSize: '14px', color: '#333' },
  badge: { color: '#fff', padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
};

export default AdminDashboard;