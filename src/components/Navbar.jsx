import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/destinations', label: 'Destinations' },
    ...(user ? [
      { to: '/my-bookings', label: 'My Bookings' },
      { to: '/my-reviews', label: 'My Reviews' },
    ] : []),
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.3s, box-shadow 0.3s;
          background: ${scrolled ? 'rgba(15,20,40,0.97)' : 'rgba(15,20,40,0.75)'};
          backdrop-filter: blur(12px);
          box-shadow: ${scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none'};
        }
        .navbar__logo {
          font-family: 'Sora', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .navbar__logo span { color: #e94560; }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0; padding: 0;
        }
        .navbar__links a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .navbar__links a:hover,
        .navbar__links a.active {
          background: rgba(233,69,96,0.15);
          color: #e94560;
        }
        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-admin {
          font-size: 0.82rem;
          padding: 0.35rem 0.9rem;
          background: rgba(233,69,96,0.15);
          color: #e94560;
          border: 1px solid rgba(233,69,96,0.4);
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-admin:hover { background: rgba(233,69,96,0.3); }
        .btn-logout {
          font-size: 0.85rem;
          padding: 0.4rem 1rem;
          background: #e94560;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-logout:hover { background: #c73652; }
        .btn-login {
          font-size: 0.85rem;
          padding: 0.4rem 1rem;
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: border-color 0.2s;
        }
        .btn-login:hover { border-color: #e94560; color: #e94560; }
        .btn-register {
          font-size: 0.85rem;
          padding: 0.4rem 1rem;
          background: #e94560;
          color: #fff;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-register:hover { background: #c73652; color: #fff; }
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .navbar__hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }
        .navbar__hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .navbar__hamburger.open span:nth-child(2) { opacity: 0; }
        .navbar__hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .navbar__mobile {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: rgba(15,20,40,0.98);
          padding: 1rem 1.5rem 1.5rem;
          flex-direction: column;
          gap: 0.25rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .navbar__mobile.open { display: flex; }
        .navbar__mobile a, .navbar__mobile button {
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.65rem 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: none;
          border-left: none; border-right: none; border-top: none;
          text-align: left;
          cursor: pointer;
          width: 100%;
        }
        .navbar__mobile a:last-child, .navbar__mobile button:last-child {
          border-bottom: none;
        }
        @media (max-width: 768px) {
          .navbar__links, .navbar__actions { display: none; }
          .navbar__hamburger { display: flex; }
        }
      `}</style>

      <nav className="navbar">
        <Link to="/" className="navbar__logo">
          ✈ Tour<span>Vista</span>
        </Link>

        <ul className="navbar__links">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className={location.pathname === to ? 'active' : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          {user ? (
            <>
              {isAdmin && <Link to="/admin/dashboard" className="btn-admin">Admin Panel</Link>}
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>

        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`navbar__mobile ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to}>{label}</Link>
        ))}
        {user ? (
          <>
            {isAdmin && <Link to="/admin/dashboard">Admin Panel</Link>}
            <button onClick={handleLogout} style={{ color: '#e94560' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;