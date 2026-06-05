import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.code}>403</div>
        <div style={styles.icon}>🚫</div>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.desc}>
          You don't have permission to view this page.<br />
          Please contact an administrator if you think this is a mistake.
        </p>
        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={() => navigate('/')}>
            Go to Home
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f6fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '60px 50px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    maxWidth: '460px',
    width: '100%',
  },
  code: {
    fontSize: '80px',
    fontWeight: '800',
    color: '#f4f6fa',
    lineHeight: 1,
    marginBottom: '8px',
    fontFamily: "'Sora', sans-serif",
    textShadow: '0 2px 8px rgba(233,69,96,0.10)',
    letterSpacing: '-2px',
    background: 'linear-gradient(135deg, #e94560, #c73652)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  icon: { fontSize: '52px', marginBottom: '16px' },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '14px',
    fontFamily: "'Sora', sans-serif",
  },
  desc: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.8',
    marginBottom: '32px',
  },
  actions: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  secondaryBtn: {
    background: '#fff',
    color: '#1a1a2e',
    border: '1.5px solid #e8eaf0',
    padding: '12px 28px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default Unauthorized;