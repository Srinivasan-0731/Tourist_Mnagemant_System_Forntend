import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <h1 style={styles.brandName}>✈️ TravelMS</h1>
        <p style={styles.brandTag}>Your dream destination awaits</p>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back!</h2>
          <p style={styles.sub}>Login to your account</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                style={styles.input} required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                name="password" type="password" placeholder="Enter password"
                value={form.password} onChange={handleChange}
                style={styles.input} required
              />
            </div>
            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>
          <p style={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>Create one</Link>
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
  brandTag: { fontSize: '18px', color: '#aaa', textAlign: 'center' },
  right: {
    width: '480px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px', background: '#f4f6fa'
  },
  card: {
    background: '#fff', padding: '40px', borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)', width: '100%'
  },
  title: { fontSize: '26px', color: '#1a1a2e', margin: '0 0 5px', fontWeight: 'bold' },
  sub: { color: '#888', marginBottom: '28px', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', color: '#555', fontWeight: '500' },
  input: {
    padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px',
    fontSize: '15px', outline: 'none'
  },
  btn: {
    padding: '14px', background: '#e94560', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold',
    marginTop: '5px'
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: 'bold' },
};

export default Login;