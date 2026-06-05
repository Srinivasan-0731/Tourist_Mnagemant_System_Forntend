import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import API from '../api/api';
import { formatPrice, truncate } from '../lib/helpers';
import { useDebounce } from '../lib/hooks';
import { PACKAGE_TYPES } from '../lib/constants';

const formatDuration = (d) => {
  if (!d) return '';
  if (typeof d === 'string') return d;
  if (d.days && d.nights) return `${d.days}D / ${d.nights}N`;
  if (d.days) return `${d.days} Days`;
  return '';
};

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch]     = useState('');
  const [type, setType]         = useState('');
  const [loading, setLoading]   = useState(true);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setLoading(true);
    let url = '/packages?limit=30';
    if (debouncedSearch) url += `&search=${debouncedSearch}`;
    if (type)            url += `&packageType=${type}`;
    API.get(url)
      .then(r => setPackages(r.data.data || []))
      .finally(() => setLoading(false));
  }, [debouncedSearch, type]);

  return (
    <div>
      <Navbar />

      <div style={styles.header}>
        <h1 style={styles.title}>Travel Packages</h1>
        <p style={styles.sub}>Choose from our carefully curated travel packages</p>
        <div style={styles.filters}>
          <input
            placeholder="🔍 Search packages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.search}
          />
          <select value={type} onChange={e => setType(e.target.value)} style={styles.select}>
            <option value="">All Types</option>
            {PACKAGE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.section}>
        {loading ? <Loader /> : packages.length === 0 ? (
          <p style={styles.empty}>No packages found. Try a different search.</p>
        ) : (
          <div style={styles.grid}>
            {packages.map(p => (
              <div key={p._id} style={styles.card}>
                <div style={styles.imgWrapper}>
                  {/* image fallback fix */}
                  <img
                    src={p.image || 'https://placehold.co/400x210?text=No+Image'}
                    alt={p.title}
                    style={styles.cardImg}
                  />
                  <span style={styles.typeBadge}>{p.packageType}</span>
                  {p.featured && <span style={styles.featuredBadge}>⭐ Featured</span>}
                  {p.discountPrice > 0 && (
                    <span style={styles.discountBadge}>
                      {Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{p.title}</h3>
                  <p style={styles.cardDesc}>{truncate(p.description, 85)}</p>
                  <div style={styles.cardMeta}>
                    {/* duration object fix */}
                    <span>⏱ {formatDuration(p.duration)}</span>
                    <span>👥 Max {p.maxGuests}</span>
                    <span>🗺️ {p.packageType}</span>
                  </div>
                  <div style={styles.cardFooter}>
                    <div>
                      {p.discountPrice > 0 && (
                        <span style={styles.oldPrice}>{formatPrice(p.price)}</span>
                      )}
                      <span style={styles.price}>
                        {formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}
                      </span>
                    </div>
                    <Link to={`/packages/${p._id}`} style={styles.viewBtn}>View Details</Link>
                  </div>
                </div>
              </div>
            ))}
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
    color: '#fff', padding: '70px 40px', textAlign: 'center'
  },
  title: { fontSize: '42px', margin: '0 0 10px' },
  sub: { color: '#ccc', marginBottom: '30px', fontSize: '16px' },
  filters: { display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' },
  search: { padding: '13px 22px', borderRadius: '30px', border: 'none', fontSize: '15px', width: '320px', outline: 'none' },
  select: { padding: '13px 22px', borderRadius: '30px', border: 'none', fontSize: '15px', cursor: 'pointer', outline: 'none' },
  section: { padding: '55px 40px' },
  empty: { textAlign: 'center', color: '#888', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' },
  card: { background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  imgWrapper: { position: 'relative' },
  cardImg: { width: '100%', height: '210px', objectFit: 'cover', display: 'block' },
  typeBadge: {
    position: 'absolute', top: '10px', left: '10px',
    background: '#e94560', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px'
  },
  featuredBadge: {
    position: 'absolute', top: '10px', right: '10px',
    background: '#f5a623', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px'
  },
  discountBadge: {
    position: 'absolute', bottom: '10px', right: '10px',
    background: '#2e7d32', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
  },
  cardBody: { padding: '18px' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' },
  cardDesc: { color: '#666', fontSize: '14px', lineHeight: 1.5, margin: '0 0 12px' },
  cardMeta: { display: 'flex', gap: '12px', color: '#888', fontSize: '13px', marginBottom: '14px', flexWrap: 'wrap' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  oldPrice: { color: '#aaa', textDecoration: 'line-through', fontSize: '13px', marginRight: '6px' },
  price: { color: '#e94560', fontWeight: 'bold', fontSize: '19px' },
  viewBtn: {
    background: '#1a1a2e', color: '#fff', padding: '9px 18px',
    borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '500'
  },
};

export default Packages;