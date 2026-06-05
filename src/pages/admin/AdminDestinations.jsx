import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/api';
import { formatPrice } from '../../lib/helpers';
import { CATEGORIES } from '../../lib/constants';

const emptyForm = {
  name: '', country: '', category: 'beach', price: '',
  description: '', image: '', featured: false, duration: ''
};

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [editData, setEditData]         = useState(null);
  const [form, setForm]                 = useState(emptyForm);
  const [search, setSearch]             = useState('');

  const fetchAll = () => API.get('/destinations?limit=50').then(r => setDestinations(r.data.data || []));
  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const openCreate = () => { setEditData(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (d) => {
    setEditData(d);
    setForm({ name: d.name, country: d.country, category: d.category,
      price: d.price, description: d.description, image: d.image,
      featured: d.featured, duration: d.duration || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await API.put(`/destinations/${editData._id}`, form);
        toast.success('Destination updated!');
      } else {
        await API.post('/destinations', form);
        toast.success('Destination created!');
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await API.delete(`/destinations/${id}`);
      toast.success('Deleted!');
      fetchAll();
    } catch {
      toast.error('Delete failed!');
    }
  };

  const filtered = destinations.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.layout}>
      <AdminSidebar />
      <div style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>Destinations ({destinations.length})</h1>
          <div style={styles.topActions}>
            <input placeholder="Search..." value={search}
              onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
            <button onClick={openCreate} style={styles.addBtn}>+ Add New</button>
          </div>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{ margin: '0 0 20px', color: '#1a1a2e' }}>
              {editData ? '✏️ Edit Destination' : '➕ Add Destination'}
            </h3>
            <form onSubmit={handleSubmit} style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Name *</label>
                <input name="name" placeholder="Paris" value={form.name} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Country *</label>
                <input name="country" placeholder="France" value={form.country} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Starting Price *</label>
                <input name="price" type="number" placeholder="500" value={form.price} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Duration</label>
                <input name="duration" placeholder="5 Days" value={form.duration} onChange={handleChange} style={styles.input} />
              </div>
              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Image URL</label>
                <input name="image" placeholder="https://..." value={form.image} onChange={handleChange} style={styles.input} />
              </div>
              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Description</label>
                <textarea name="description" placeholder="Describe the destination..." value={form.description}
                  onChange={handleChange} rows={3} style={{ ...styles.input, resize: 'vertical' }} />
              </div>
              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  Mark as Featured
                </label>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.saveBtn}>{editData ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Country</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Featured</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d._id} style={styles.tr}>
                  <td style={styles.td}><img src={d.image} alt="" style={styles.thumb} /></td>
                  <td style={styles.td}><strong>{d.name}</strong></td>
                  <td style={styles.td}>{d.country}</td>
                  <td style={styles.td}><span style={styles.catBadge}>{d.category}</span></td>
                  <td style={styles.td}>{formatPrice(d.price)}</td>
                  <td style={styles.td}>⭐ {d.rating}</td>
                  <td style={styles.td}>{d.featured ? '✅' : '—'}</td>
                  <td style={styles.td}>
                    <button onClick={() => openEdit(d)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(d._id)} style={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  topActions: { display: 'flex', gap: '10px', alignItems: 'center' },
  searchInput: { padding: '9px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '200px' },
  addBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' },
  formCard: { background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '25px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', color: '#555', fontWeight: '500' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' },
  input: { padding: '10px 13px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  saveBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { background: '#f0f0f0', color: '#555', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: 'pointer' },
  tableWrap: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' },
  thead: { background: '#1a1a2e' },
  th: { color: '#fff', padding: '14px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '500' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px', fontSize: '13px', color: '#333', verticalAlign: 'middle' },
  thumb: { width: '65px', height: '48px', objectFit: 'cover', borderRadius: '7px' },
  catBadge: { background: '#e3f2fd', color: '#1565c0', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' },
  editBtn: { background: '#1565c0', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontSize: '12px' },
  deleteBtn: { background: '#c62828', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
};

export default AdminDestinations;