import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import { formatDate, getInitials } from '../lib/helpers';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm]       = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState('profile');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/auth/profile', form);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={styles.header}>
        <div style={styles.avatarCircle}>{getInitials(user?.name)}</div>
        <h2 style={styles.name}>{user?.name}</h2>
        <p style={styles.email}>{user?.email}</p>
        <span style={styles.roleBadge}>{user?.role}</span>
      </div>

      <div style={styles.container}>
        <div style={styles.tabs}>
          {['profile', 'security'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}>
              {t === 'profile' ? '👤 Profile' : '🔐 Security'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Update Profile</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input value={user?.email} disabled style={{ ...styles.input, background: '#f5f5f5', color: '#aaa' }} />
                <small style={{ color: '#aaa', fontSize: '12px' }}>Email cannot be changed</small>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Member Since</label>
                <input value={formatDate(user?.createdAt)} disabled
                  style={{ ...styles.input, background: '#f5f5f5', color: '#aaa' }} />
              </div>
              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? '⏳ Updating...' : '✅ Save Changes'}
              </button>
            </form>
          </div>
        )}

        {tab === 'security' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Security Settings</h3>
            <div style={styles.securityItem}>
              <div>
                <p style={styles.secLabel}>Password</p>
                <p style={styles.secDesc}>Change your account password</p>
              </div>
              <button style={styles.secBtn}>Change Password</button>
            </div>
            <div style={styles.securityItem}>
              <div>
                <p style={styles.secLabel}>Account Status</p>
                <p style={styles.secDesc}>Your account is active and verified</p>
              </div>
              <span style={styles.activeBadge}>✓ Active</span>
            </div>
            <div style={{ marginTop: '25px', padding: '18px', background: '#fff5f7', borderRadius: '10px', border: '1px solid #ffcdd2' }}>
              <p style={{ color: '#c62828', fontWeight: 'bold', margin: '0 0 5px' }}>Quick Links</p>
              <Link to="/my-bookings" style={{ color: '#e94560', textDecoration: 'none', fontSize: '14px' }}>
                → View My Bookings
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    color: '#fff', padding: '55px 40px', textAlign: 'center'
  },
  avatarCircle: {
    width: '90px', height: '90px', borderRadius: '50%', background: '#e94560',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '34px', fontWeight: 'bold', color: '#fff', margin: '0 auto 15px'
  },
  name: { fontSize: '26px', margin: '0 0 5px' },
  email: { color: '#aaa', margin: '0 0 12px' },
  roleBadge: {
    background: '#e94560', color: '#fff', padding: '4px 18px',
    borderRadius: '12px', fontSize: '13px', fontWeight: 'bold'
  },
  container: { maxWidth: '600px', margin: '40px auto', padding: '0 20px 60px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
  tab: {
    flex: 1, padding: '12px', background: '#fff', border: '2px solid #e0e0e0',
    borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: '#555'
  },
  activeTab: { border: '2px solid #e94560', color: '#e94560', background: '#fff5f7' },
  card: {
    background: '#fff', borderRadius: '14px', padding: '35px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  cardTitle: { fontSize: '20px', color: '#1a1a2e', margin: '0 0 25px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', color: '#555', fontWeight: '500' },
  input: {
    padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px'
  },
  btn: {
    marginTop: '8px', padding: '13px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold'
  },
  securityItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 0', borderBottom: '1px solid #f0f0f0'
  },
  secLabel: { margin: '0 0 4px', fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' },
  secDesc: { margin: 0, color: '#888', fontSize: '13px' },
  secBtn: {
    background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 16px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
  },
  activeBadge: {
    background: '#e8f5e9', color: '#2e7d32', padding: '6px 14px',
    borderRadius: '10px', fontSize: '13px', fontWeight: 'bold'
  },
};

export default Profile;