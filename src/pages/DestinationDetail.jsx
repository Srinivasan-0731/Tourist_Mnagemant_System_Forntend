import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import API from '../api/api';
import { formatPrice, renderStars } from '../lib/helpers';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [packages, setPackages]       = useState([]);
  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/destinations/${id}`),
      API.get(`/packages?destination=${id}&limit=6`),
      API.get(`/reviews/destination/${id}`),
    ]).then(([d, p, r]) => {
      setDestination(d.data.data);
      setPackages(p.data.data || []);
      setReviews(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><Loader /></>;
  if (!destination) return <><Navbar /><p style={{ textAlign: 'center', padding: '80px' }}>Destination not found.</p></>;

  return (
    <div>
      <Navbar />

      <div style={{ ...styles.hero, backgroundImage: `url(${destination.image})` }}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>{destination.name}</h1>
          <p style={styles.heroCountry}>📍 {destination.country}</p>
          <div style={styles.heroBadges}>
            <span style={styles.badge}>⭐ {destination.rating}</span>
            <span style={styles.badge}>{destination.category}</span>
            <span style={styles.badge}>{destination.totalReviews} Reviews</span>
            <span style={styles.badge}>{destination.duration}</span>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.main}>
          <h2 style={styles.sectionHeading}>About {destination.name}</h2>
          <p style={styles.description}>{destination.description}</p>

          {destination.highlights?.length > 0 && (
            <div style={styles.block}>
              <h3 style={styles.blockTitle}>🎯 Highlights</h3>
              <div style={styles.tagList}>
                {destination.highlights.map((h, i) => (
                  <span key={i} style={styles.highlightTag}>✓ {h}</span>
                ))}
              </div>
            </div>
          )}

          <div style={styles.twoCol}>
            {destination.included?.length > 0 && (
              <div style={styles.includeBox}>
                <h4 style={{ color: '#2e7d32', margin: '0 0 12px' }}>✅ Included</h4>
                {destination.included.map((item, i) => (
                  <p key={i} style={styles.listItem}>• {item}</p>
                ))}
              </div>
            )}
            {destination.notIncluded?.length > 0 && (
              <div style={styles.excludeBox}>
                <h4 style={{ color: '#c62828', margin: '0 0 12px' }}>❌ Not Included</h4>
                {destination.notIncluded.map((item, i) => (
                  <p key={i} style={styles.listItem}>• {item}</p>
                ))}
              </div>
            )}
          </div>

          {packages.length > 0 && (
            <div style={styles.block}>
              <h3 style={styles.blockTitle}>📦 Available Packages</h3>
              <div style={styles.packageGrid}>
                {packages.map(p => (
                  <Link to={`/packages/${p._id}`} key={p._id} style={styles.packageCard}>
                    <img src={p.image} alt={p.title} style={styles.packageImg} />
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ margin: '0 0 5px', color: '#1a1a2e', fontSize: '15px' }}>{p.title}</h4>
                      <p style={{ color: '#e94560', fontWeight: 'bold', margin: '0 0 3px' }}>
                        {formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}
                      </p>
                      <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{p.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {reviews.length > 0 && (
            <div style={styles.block}>
              <h3 style={styles.blockTitle}>⭐ Traveler Reviews</h3>
              {reviews.map(r => (
                <div key={r._id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewAvatar}>{r.user?.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <p style={styles.reviewName}>{r.user?.name}</p>
                      <p style={styles.reviewStars}>{renderStars(r.rating)}</p>
                    </div>
                  </div>
                  {r.title && <p style={{ fontWeight: 'bold', margin: '8px 0 4px' }}>{r.title}</p>}
                  <p style={{ color: '#666', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.sidebar}>
          <div style={styles.priceCard}>
            <h3 style={{ margin: '0 0 5px', color: '#1a1a2e' }}>Starting From</h3>
            <p style={styles.bigPrice}>{formatPrice(destination.price)}</p>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 20px' }}>per person</p>
            <div style={styles.infoBox}>
              <p style={styles.infoRow}>🌍 Country: <strong>{destination.country}</strong></p>
              <p style={styles.infoRow}>📂 Category: <strong>{destination.category}</strong></p>
              {destination.duration && <p style={styles.infoRow}>⏱ Duration: <strong>{destination.duration}</strong></p>}
              <p style={styles.infoRow}>⭐ Rating: <strong>{destination.rating}</strong></p>
            </div>
            <Link to={`/packages?destination=${id}`} style={styles.bookBtn}>Browse Packages</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  hero: { height: '450px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'flex-end', color: '#fff', paddingBottom: '40px'
  },
  heroTitle: { fontSize: '48px', margin: '0 0 8px', textAlign: 'center' },
  heroCountry: { fontSize: '18px', margin: '0 0 15px' },
  heroBadges: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
  badge: { background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', fontSize: '13px' },
  container: { display: 'flex', gap: '30px', padding: '45px 40px', maxWidth: '1200px', margin: '0 auto' },
  main: { flex: 1, minWidth: 0 },
  sidebar: { width: '290px', flexShrink: 0 },
  sectionHeading: { fontSize: '24px', color: '#1a1a2e', margin: '0 0 15px' },
  description: { color: '#555', lineHeight: 1.8, fontSize: '16px' },
  block: { marginTop: '35px' },
  blockTitle: { fontSize: '20px', color: '#1a1a2e', margin: '0 0 15px' },
  tagList: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  highlightTag: { background: '#e8f5e9', color: '#2e7d32', padding: '7px 16px', borderRadius: '20px', fontSize: '14px' },
  twoCol: { display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' },
  includeBox: { flex: 1, background: '#f1f8e9', borderRadius: '12px', padding: '18px', minWidth: '200px' },
  excludeBox: { flex: 1, background: '#ffebee', borderRadius: '12px', padding: '18px', minWidth: '200px' },
  listItem: { margin: '5px 0', color: '#555', fontSize: '14px' },
  packageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' },
  packageCard: { background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textDecoration: 'none' },
  packageImg: { width: '100%', height: '120px', objectFit: 'cover' },
  reviewCard: { background: '#f8f9fa', borderRadius: '12px', padding: '18px', marginBottom: '15px' },
  reviewHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' },
  reviewAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0 },
  reviewName: { margin: 0, fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' },
  reviewStars: { margin: 0, fontSize: '14px' },
  priceCard: { background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' },
  bigPrice: { fontSize: '38px', color: '#e94560', fontWeight: 'bold', margin: '5px 0 0' },
  infoBox: { background: '#f8f9fa', borderRadius: '10px', padding: '15px', margin: '0 0 20px' },
  infoRow: { margin: '6px 0', fontSize: '14px', color: '#555' },
  bookBtn: { display: 'block', background: '#e94560', color: '#fff', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center', fontSize: '15px' },
};

export default DestinationDetail;