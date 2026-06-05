import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <>
    <style>{`
      .footer {
        background: #0a0e1f;
        color: rgba(255,255,255,0.6);
        padding: 3rem 2rem 1.5rem;
        margin-top: auto;
        border-top: 1px solid rgba(255,255,255,0.07);
      }
      .footer__grid {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 2.5rem;
        margin-bottom: 2rem;
      }
      .footer__brand-name {
        font-family: 'Sora', sans-serif;
        font-size: 1.3rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 0.75rem;
      }
      .footer__brand-name span { color: #e94560; }
      .footer__brand p {
        font-size: 0.88rem;
        line-height: 1.7;
        max-width: 280px;
      }
      .footer__col h4 {
        color: #fff;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 1rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .footer__col ul {
        list-style: none;
        padding: 0; margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .footer__col ul a {
        color: rgba(255,255,255,0.55);
        text-decoration: none;
        font-size: 0.88rem;
        transition: color 0.2s;
      }
      .footer__col ul a:hover { color: #e94560; }
      .footer__bottom {
        max-width: 1100px;
        margin: 0 auto;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255,255,255,0.07);
        text-align: center;
        font-size: 0.82rem;
      }
      @media (max-width: 640px) {
        .footer__grid { grid-template-columns: 1fr; gap: 1.5rem; }
      }
    `}</style>
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <div className="footer__brand-name">✈ Tour<span>Vista</span></div>
          <p>Discover incredible destinations and create unforgettable memories with our curated travel experiences.</p>
        </div>
        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/my-reviews">My Reviews</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} TourVista. All rights reserved.</p>
      </div>
    </footer>
  </>
);

export default Footer;