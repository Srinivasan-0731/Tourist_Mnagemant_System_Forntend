import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import API from '../api/api';
import { formatPrice, truncate } from '../lib/helpers';
import { useDebounce } from '../lib/hooks';
import { CATEGORIES } from '../lib/constants';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('');
  const [loading, setLoading]           = useState(true);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setLoading(true);
    let url = '/destinations?limit=30';
    if (debouncedSearch) url += `&search=${debouncedSearch}`;
    if (category)        url += `&category=${category}`;
    API.get(url)
      .then(r => setDestinations(r.data.data || []))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category]);

  return (
    <div>
      <Navbar />

      <div style={styles.header}>
        <h1 style={styles.title}>Explore Destinations</h1>
        <p style={styles.sub}>Find your perfect travel destination</p>
        <div style={styles.filters}>
          <input
            placeholder="🔍 Search destinations..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={styles.search}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={styles.select}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.section}>
        {loading ? <Loader /> : destinations.length === 0 ? (
          <p style={styles.empty}>No destinations found. Try a different search.</p>
        ) : (
          <div style={styles.grid}>
            {destinations.map(d => (
              <Link to={`/destinations/${d._id}`} key={d._id} style={styles.card}>
                <div style={styles.imgWrapper}>
                  <img src={d.image} alt={d.name} style={styles.cardImg} />
                  <span style={styles.categoryBadge}>{d.category}</span>
                  {d.featured && <span style={styles.featuredBadge}>⭐ Featured</span>}
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{d.name}</h3>
                  <p style={styles.cardCountry}>📍 {d.country}</p>
                  <p style={styles.cardDesc}>{truncate(d.description, 80)}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>From {formatPrice(d.price)}</span>
                    <span style={styles.rating}>⭐ {d.rating} ({d.totalReviews})</span>
                  </div>
                </div>
              </Link>
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
  search: {
    padding: '13px 22px', borderRadius: '30px', border: 'none',
    fontSize: '15px', width: '320px', outline: 'none'
  },
  select: {
    padding: '13px 22px', borderRadius: '30px', border: 'none',
    fontSize: '15px', cursor: 'pointer', outline: 'none'
  },
  section: { padding: '55px 40px' },
  empty: { textAlign: 'center', color: '#888', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '28px' },
  card: {
    background: '#fff', borderRadius: '14px', overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit'
  },
  imgWrapper: { position: 'relative' },
  cardImg: { width: '100%', height: '210px', objectFit: 'cover', display: 'block' },
  categoryBadge: {
    position: 'absolute', bottom: '10px', left: '10px',
    background: 'rgba(0,0,0,0.65)', color: '#fff',
    padding: '4px 12px', borderRadius: '12px', fontSize: '12px'
  },
  featuredBadge: {
    position: 'absolute', top: '10px', right: '10px',
    background: '#f5a623', color: '#fff',
    padding: '4px 12px', borderRadius: '12px', fontSize: '12px'
  },
  cardBody: { padding: '18px' },
  cardTitle: { fontSize: '19px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 5px' },
  cardCountry: { color: '#888', fontSize: '13px', margin: '0 0 8px' },
  cardDesc: { color: '#666', fontSize: '14px', lineHeight: 1.5, margin: '0 0 12px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#e94560', fontWeight: 'bold', fontSize: '16px' },
  rating: { color: '#f5a623', fontSize: '13px' },
};

export default Destinations;