import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import { formatPrice } from '../lib/helpers';

const formatDuration = (d) => {
  if (!d) return '';
  if (typeof d === 'string') return d;
  if (d.days && d.nights) return `${d.days}D / ${d.nights}N`;
  if (d.days) return `${d.days} Days`;
  return '';
};

const PackageDetail = () => {
  const { id }   = useParams();
  const { user } = useAuth();
  const [pkg, setPkg]         = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/packages/${id}`)
      .then(r => setPkg(r.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><Loader /></>;
  if (!pkg)    return <><Navbar /><p style={{ textAlign: 'center', padding: '80px' }}>Package not found.</p></>;

  const finalPrice = pkg.discountPrice > 0 ? pkg.discountPrice : pkg.price;
  const discount   = pkg.discountPrice > 0
    ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100)
    : 0;

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div style={{
        ...styles.hero,
        backgroundImage: pkg.image ? `url(${pkg.image})` : 'none',
        background: pkg.image ? undefined : '#1a1a2e'
      }}>
        <div style={styles.overlay}>
          <span style={styles.typeBadge}>{pkg.packageType?.toUpperCase()}</span>
          <h1 style={styles.heroTitle}>{pkg.title}</h1>
          <p style={styles.heroMeta}>⏱ {formatDuration(pkg.duration)} &nbsp;|&nbsp; 👥 Max {pkg.maxGuests} guests</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.main}>
          <h2 style={styles.heading}>About This Package</h2>
          <p style={styles.desc}>{pkg.description}</p>

          <div style={styles.twoCol}>
            {pkg.included?.length > 0 && (
              <div style={styles.includeBox}>
                <h4 style={{ color: '#2e7d32', margin: '0 0 12px' }}>✅ Included</h4>
                {pkg.included.map((item, i) => (
                  <p key={i} style={styles.listItem}>• {item}</p>
                ))}
              </div>
            )}
            {pkg.notIncluded?.length > 0 && (
              <div style={styles.excludeBox}>
                <h4 style={{ color: '#c62828', margin: '0 0 12px' }}>❌ Not Included</h4>
                {pkg.notIncluded.map((item, i) => (
                  <p key={i} style={styles.listItem}>• {item}</p>
                ))}
              </div>
            )}
          </div>

          {pkg.highlights?.length > 0 && (
            <div style={styles.block}>
              <h3 style={styles.blockTitle}>🎯 Highlights</h3>
              <div style={styles.tagList}>
                {pkg.highlights.map((h, i) => (
                  <span key={i} style={styles.tag}>✓ {h}</span>
                ))}
              </div>
            </div>
          )}

          {pkg.itinerary?.length > 0 && (
            <div style={styles.block}>
              <h3 style={styles.blockTitle}>🗓️ Itinerary</h3>
              {pkg.itinerary.map((day, i) => (
                <div key={i} style={styles.itineraryItem}>
                  <div style={styles.dayBadge}>Day {day.day}</div>
                  <div>
                    <p style={styles.dayTitle}>{day.title}</p>
                    <p style={styles.dayDesc}>{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.priceCard}>
            <h3 style={{ margin: '0 0 8px', color: '#1a1a2e' }}>Package Price</h3>
            {pkg.discountPrice > 0 && (
              <>
                <p style={styles.oldPrice}>{formatPrice(pkg.price)}</p>
                <span style={styles.discountTag}>{discount}% OFF</span>
              </>
            )}
            <p style={styles.bigPrice}>{formatPrice(finalPrice)}</p>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 20px' }}>per person</p>

            <div style={styles.infoBox}>
              <p style={styles.infoRow}>⏱ Duration: <strong>{formatDuration(pkg.duration)}</strong></p>
              <p style={styles.infoRow}>👥 Max Guests: <strong>{pkg.maxGuests}</strong></p>
              <p style={styles.infoRow}>📦 Type: <strong>{pkg.packageType}</strong></p>
              {pkg.totalBookings > 0 && (
                <p style={styles.infoRow}>📋 Bookings: <strong>{pkg.totalBookings}</strong></p>
              )}
            </div>

            {user ? (
              <Link to={`/booking/${pkg._id}`} style={styles.bookBtn}>Book Now 🚀</Link>
            ) : (
              <Link to="/login" style={styles.bookBtn}>Login to Book</Link>
            )}
            <Link to="/packages" style={styles.backBtn}>← All Packages</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  hero: { height: '420px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3))',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'flex-end', color: '#fff', paddingBottom: '45px'
  },
  typeBadge: {
    background: '#e94560', color: '#fff', padding: '5px 16px',
    borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px'
  },
  heroTitle: { fontSize: '42px', margin: '0 0 10px', textAlign: 'center' },
  heroMeta: { color: '#ddd', fontSize: '16px' },
  container: { display: 'flex', gap: '35px', padding: '45px 40px', maxWidth: '1200px', margin: '0 auto' },
  main: { flex: 1, minWidth: 0 },
  sidebar: { width: '300px', flexShrink: 0 },
  heading: { fontSize: '24px', color: '#1a1a2e', margin: '0 0 15px' },
  desc: { color: '#555', lineHeight: 1.8, fontSize: '16px' },
  twoCol: { display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' },
  includeBox: { flex: 1, background: '#f1f8e9', borderRadius: '12px', padding: '18px', minWidth: '200px' },
  excludeBox: { flex: 1, background: '#ffebee', borderRadius: '12px', padding: '18px', minWidth: '200px' },
  listItem: { margin: '5px 0', color: '#555', fontSize: '14px' },
  block: { marginTop: '35px' },
  blockTitle: { fontSize: '20px', color: '#1a1a2e', margin: '0 0 15px' },
  tagList: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  tag: { background: '#e3f2fd', color: '#1565c0', padding: '7px 16px', borderRadius: '20px', fontSize: '14px' },
  itineraryItem: { display: 'flex', gap: '15px', marginBottom: '18px', alignItems: 'flex-start' },
  dayBadge: {
    background: '#e94560', color: '#fff', padding: '6px 14px',
    borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', flexShrink: 0
  },
  dayTitle: { margin: '0 0 4px', fontWeight: 'bold', color: '#1a1a2e' },
  dayDesc: { margin: 0, color: '#666', fontSize: '14px', lineHeight: 1.6 },
  priceCard: {
    background: '#fff', borderRadius: '14px', padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '20px'
  },
  oldPrice: { color: '#aaa', textDecoration: 'line-through', fontSize: '16px', margin: '0' },
  discountTag: {
    background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px',
    borderRadius: '10px', fontSize: '13px', fontWeight: 'bold'
  },
  bigPrice: { fontSize: '38px', color: '#e94560', fontWeight: 'bold', margin: '5px 0 0' },
  infoBox: { background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '0 0 20px' },
  infoRow: { margin: '7px 0', fontSize: '14px', color: '#555' },
  bookBtn: {
    display: 'block', background: '#e94560', color: '#fff', padding: '14px',
    borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold',
    textAlign: 'center', fontSize: '16px', marginBottom: '10px'
  },
  backBtn: {
    display: 'block', textAlign: 'center', color: '#888',
    textDecoration: 'none', fontSize: '14px', marginTop: '5px'
  },
};

export default PackageDetail;