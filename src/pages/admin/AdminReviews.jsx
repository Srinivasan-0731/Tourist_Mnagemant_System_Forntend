import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/api';
import { formatDate, renderStars } from '../../lib/helpers';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const fetchAll = () => {
    API.get('/admin/reviews')
      .then(r => setReviews(r.data.data || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await API.delete(`/admin/reviews/${id}`);
      toast.success('Review deleted!');
      fetchAll();
    } catch {
      toast.error('Delete failed!');
    }
  };

  const filtered = reviews.filter(r =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.destination?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.layout}>
      <AdminSidebar />
      <div style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>Reviews ({reviews.length})</h1>
          <input placeholder="Search reviews..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={styles.searchInput} />
        </div>

        <div style={styles.tableWrap}>
          {loading ? <p style={{ padding: '20px' }}>Loading...</p> : filtered.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No reviews found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Destination</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Comment</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>{r.user?.name?.[0]?.toUpperCase()}</div>
                        <span>{r.user?.name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{r.destination?.name || '—'}</td>
                    <td style={styles.td}>
                      <span style={styles.ratingBadge}>{renderStars(r.rating)} {r.rating}/5</span>
                    </td>
                    <td style={styles.td}>{r.title || '—'}</td>
                    <td style={styles.td} title={r.comment}>
                      {r.comment?.slice(0, 50)}{r.comment?.length > 50 ? '...' : ''}
                    </td>
                    <td style={styles.td}>{formatDate(r.createdAt)}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(r._id)} style={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f4f6fa' },
  main: { flex: 1, padding: '35px', overflowX: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' },
  heading: { fontSize: '26px', color: '#1a1a2e', margin: 0 },
  searchInput: { padding: '9px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '250px' },
  tableWrap: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' },
  thead: { background: '#1a1a2e' },
  th: { color: '#fff', padding: '14px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '500' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px', fontSize: '13px', color: '#333', verticalAlign: 'middle', maxWidth: '200px' },
  userCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%', background: '#e94560',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 'bold', fontSize: '13px', flexShrink: 0
  },
  ratingBadge: { background: '#fff8e1', color: '#f5a623', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },
  deleteBtn: { background: '#c62828', color: '#fff', border: 'none', padding: '7px 15px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px' },
};

export default AdminReviews;