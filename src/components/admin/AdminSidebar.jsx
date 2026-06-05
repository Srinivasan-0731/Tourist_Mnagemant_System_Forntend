import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { path: '/admin',               label: '📊 Dashboard' },
    { path: '/admin/destinations',  label: '🌍 Destinations' },
    { path: '/admin/packages',      label: '📦 Packages' },
    { path: '/admin/bookings',      label: '📋 Bookings' },
    { path: '/admin/users',         label: '👥 Users' },
    { path: '/admin/reviews',       label: '⭐ Reviews' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoBox}>
        <div style={styles.logo}>✈️ TravelMS</div>
        <div style={styles.adminLabel}>Admin Panel</div>
      </div>

      {user && (
        <div style={styles.userBox}>
          <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <p style={styles.userName}>{user.name}</p>
            <p style={styles.userRole}>Administrator</p>
          </div>
        </div>
      )}

      <nav style={styles.nav}>
        {links.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            style={{
              ...styles.link,
              ...(location.pathname === l.path ? styles.active : {})
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div style={styles.bottom}>
        <Link to="/" style={styles.viewSite}>🌐 View Site</Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '240px', minHeight: '100vh', background: '#1a1a2e',
    display: 'flex', flexDirection: 'column', flexShrink: 0
  },
  logoBox: {
    padding: '25px 20px 20px', borderBottom: '1px solid #2d2d4e'
  },
  logo: {
    color: '#e94560', fontSize: '20px', fontWeight: 'bold'
  },
  adminLabel: {
    color: '#888', fontSize: '12px', marginTop: '3px'
  },
  userBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '15px 20px', borderBottom: '1px solid #2d2d4e'
  },
  avatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: '#e94560', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#fff',
    flexShrink: 0
  },
  userName: { color: '#fff', margin: 0, fontSize: '14px', fontWeight: '500' },
  userRole: { color: '#888', margin: 0, fontSize: '12px' },
  nav: { display: 'flex', flexDirection: 'column', flex: 1, paddingTop: '10px' },
  link: {
    color: '#aaa', textDecoration: 'none', padding: '13px 22px',
    fontSize: '14px', transition: 'all 0.2s', borderLeft: '3px solid transparent'
  },
  active: {
    background: 'rgba(233,69,96,0.15)', color: '#e94560',
    borderLeft: '3px solid #e94560'
  },
  bottom: {
    padding: '20px', borderTop: '1px solid #2d2d4e',
    display: 'flex', flexDirection: 'column', gap: '10px'
  },
  viewSite: {
    color: '#aaa', textDecoration: 'none', fontSize: '14px',
    padding: '8px 12px', borderRadius: '8px', textAlign: 'center',
    border: '1px solid #2d2d4e'
  },
  logoutBtn: {
    background: 'transparent', color: '#e94560',
    border: '1px solid #e94560', padding: '8px 12px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
  },
};

export default AdminSidebar;