import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/api';
import { formatDate, renderStars } from '../lib/helpers';

const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div style={modal.overlay}>
    <div style={modal.box}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
      <h3 style={modal.title}>Delete this review?</h3>
      <p style={modal.body}>This action cannot be undone.</p>
      <div style={modal.actions}>
        <button style={modal.cancelBtn} onClick={onCancel}>Cancel</button>
        <button style={modal.confirmBtn} onClick={onConfirm}>Yes, Delete</button>
      </div>
    </div>
  </div>
);

const AddReviewModal = ({ destinations, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState({ destinationId: '', rating: 5, title: '', comment: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.destinationId) { toast.error('Please select a destination'); return; }
    if (!form.comment.trim()) { toast.error('Comment is required'); return; }
    onSubmit(form);
  };

  return (
    <div style={modal.overlay}>
      <div style={{ ...modal.box, maxWidth: 480, textAlign: 'left' }}>
        <h3 style={{ ...modal.title, textAlign: 'left', marginBottom: 20 }}>✍️ Write a Review</h3>

        {/* Destination */}
        <label style={formS.label}>Destination *</label>
        <select name="destinationId" value={form.destinationId} onChange={handleChange} style={formS.input}>
          <option value="">-- Select Destination --</option>
          {destinations.map(d => (
            <option key={d._id} value={d._id}>{d.name}, {d.country}</option>
          ))}
        </select>

        {/* Rating */}
        <label style={{ ...formS.label, marginTop: 14 }}>Rating *</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button"
              onClick={() => setForm({ ...form, rating: n })}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: '2px solid',
                borderColor: form.rating >= n ? '#f59e0b' : '#e5e7eb',
                background: form.rating >= n ? '#fef3c7' : '#fff',
                fontSize: 18, cursor: 'pointer'
              }}>
              ⭐
            </button>
          ))}
          <span style={{ alignSelf: 'center', fontSize: 13, color: '#6b7280' }}>{form.rating}/5</span>
        </div>

        {/* Title */}
        <label style={formS.label}>Title (optional)</label>
        <input
          name="title" value={form.title} onChange={handleChange}
          placeholder="e.g. Amazing experience!"
          style={formS.input}
        />

        {/* Comment */}
        <label style={{ ...formS.label, marginTop: 14 }}>Comment *</label>
        <textarea
          name="comment" value={form.comment} onChange={handleChange}
          placeholder="Share your experience..."
          rows={4}
          style={{ ...formS.input, resize: 'vertical' }}
        />

        <div style={{ ...modal.actions, marginTop: 20, justifyContent: 'flex-end' }}>
          <button style={modal.cancelBtn} onClick={onCancel} disabled={submitting}>Cancel</button>
          <button
            style={{ ...modal.confirmBtn, background: '#1a1a2e', minWidth: 120 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '⏳ Submitting...' : '✅ Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RatingBadge = ({ rating }) => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  const color  = colors[Math.round(rating) - 1] || '#ccc';
  return (
    <span style={{ background: color + '22', color, padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
      {renderStars(rating)} {rating}/5
    </span>
  );
};

const MyReviews = () => {
  const navigate                    = useNavigate();
  const [reviews,      setReviews]  = useState([]);
  const [destinations, setDests]    = useState([]);
  const [loading,      setLoading]  = useState(true);
  const [toDelete,     setToDelete] = useState(null);
  const [showAdd,      setShowAdd]  = useState(false);
  const [submitting,   setSubmit]   = useState(false);

  const fetchReviews = () => {
    setLoading(true);
    API.get('/reviews/my')
      .then(r => setReviews(r.data.data || []))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    // Destinations dropdown-க்கு fetch
    API.get('/destinations')
      .then(r => setDests(r.data.data || []))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/reviews/${toDelete}`);
      toast.success('Review deleted!');
      fetchReviews();
    } catch {
      toast.error('Delete failed!');
    } finally {
      setToDelete(null);
    }
  };

  const handleAddReview = async (form) => {
    setSubmit(true);
    try {
      await API.post('/reviews', {
        destinationId: form.destinationId,
        rating:        Number(form.rating),
        title:         form.title,
        comment:       form.comment,
      });
      toast.success('✅ Review submitted!');
      setShowAdd(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submit failed!');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div style={styles.page}>
      {toDelete && <ConfirmModal onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}
      {showAdd && (
        <AddReviewModal
          destinations={destinations}
          onSubmit={handleAddReview}
          onCancel={() => setShowAdd(false)}
          submitting={submitting}
        />
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Reviews</h1>
          <p style={styles.sub}>{reviews.length} review{reviews.length !== 1 ? 's' : ''} written</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* ✅ Add Review Button */}
          <button style={styles.addBtn} onClick={() => setShowAdd(true)}>
            ✍️ Add Review
          </button>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.grid}>
          {[1, 2, 3].map(i => <div key={i} style={styles.skeleton} />)}
        </div>
      ) : reviews.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>✍️</span>
          <h3 style={{ color: '#1a1a2e', marginTop: 12 }}>No reviews yet</h3>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Share your travel experiences!</p>
          <button style={styles.exploreBtn} onClick={() => setShowAdd(true)}>
            ✍️ Write Your First Review
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {reviews.map(r => (
            <div key={r._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.destName}>{r.destination?.name || 'Unknown Destination'}</div>
                  <div style={styles.date}>{formatDate(r.createdAt)}</div>
                </div>
                <RatingBadge rating={r.rating} />
              </div>

              {r.title && <div style={styles.reviewTitle}>"{r.title}"</div>}
              <p style={styles.comment}>{r.comment || 'No comment.'}</p>

              <div style={styles.cardFooter}>
                <button style={styles.deleteBtn} onClick={() => setToDelete(r._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page:        { minHeight: '100vh', background: '#f4f6fa', padding: '40px', fontFamily: "'DM Sans', sans-serif" },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '14px' },
  title:       { fontSize: '26px', fontWeight: '700', color: '#1a1a2e', margin: 0, fontFamily: "'Sora', sans-serif" },
  sub:         { fontSize: '13px', color: '#6b7280', marginTop: '5px' },
  addBtn:      { background: '#1a1a2e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  backBtn:     { background: '#fff', color: '#1a1a2e', border: '1.5px solid #e8eaf0', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  card:        { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '12px' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' },
  destName:    { fontSize: '15px', fontWeight: '700', color: '#1a1a2e' },
  date:        { fontSize: '12px', color: '#9ca3af', marginTop: '3px' },
  reviewTitle: { fontSize: '14px', fontStyle: 'italic', color: '#374151', fontWeight: '500' },
  comment:     { fontSize: '13px', color: '#6b7280', lineHeight: '1.7', flex: 1 },
  cardFooter:  { display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f0f0f5' },
  deleteBtn:   { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  skeleton:    { height: '180px', borderRadius: '16px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%' },
  empty:       { textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  exploreBtn:  { marginTop: '12px', background: '#1a1a2e', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
};

const formS = {
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '4px' },
};

const modal = {
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  box:        { background: '#fff', borderRadius: '16px', padding: '36px 32px', maxWidth: 380, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  title:      { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 10px' },
  body:       { fontSize: '14px', color: '#6b7280', marginBottom: '24px' },
  actions:    { display: 'flex', gap: '10px', justifyContent: 'center' },
  cancelBtn:  { padding: '10px 24px', border: '1px solid #ddd', borderRadius: '9px', cursor: 'pointer', fontSize: '14px', background: '#fff', color: '#555' },
  confirmBtn: { padding: '10px 24px', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '14px', background: '#dc2626', color: '#fff', fontWeight: '600' },
};

export default MyReviews;