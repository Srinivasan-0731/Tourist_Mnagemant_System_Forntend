import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <h1 style={styles.brandName}>✈️ TravelMS</h1>
        <p style={styles.brandTag}>Join thousands of happy travelers</p>
        <div style={styles.features}>
          {['🌍 30+ Destinations', '💰 Best Price Guarantee', '🛡️ Safe & Secure Booking', '⭐ 500+ Happy Travelers'].map((f, i) => (
            <p key={i} style={styles.featureItem}>{f}</p>
          ))}
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.sub}>Start your journey today</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input name="name" placeholder="John Doe" value={form.name}
                onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email}
                onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input name="phone" placeholder="+91 98765 43210" value={form.phone}
                onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input name="password" type="password" placeholder="Min 6 characters" value={form.password}
                onChange={handleChange} style={styles.input} required />
            </div>
            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? '⏳ Creating...' : 'Create Account →'}
            </button>
          </form>
          <p style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', color: '#fff', padding: '40px'
  },
  brandName: { fontSize: '40px', margin: '0 0 15px', color: '#e94560' },
  brandTag: { fontSize: '18px', color: '#aaa', marginBottom: '30px', textAlign: 'center' },
  features: { display: 'flex', flexDirection: 'column', gap: '12px' },
  featureItem: { color: '#ccc', fontSize: '15px', margin: 0 },
  right: {
    width: '500px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px', background: '#f4f6fa'
  },
  card: {
    background: '#fff', padding: '40px', borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)', width: '100%'
  },
  title: { fontSize: '26px', color: '#1a1a2e', margin: '0 0 5px', fontWeight: 'bold' },
  sub: { color: '#888', marginBottom: '28px', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', color: '#555', fontWeight: '500' },
  input: {
    padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px',
    fontSize: '15px', outline: 'none'
  },
  btn: {
    padding: '14px', background: '#e94560', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px'
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: 'bold' },
};

export default Register;