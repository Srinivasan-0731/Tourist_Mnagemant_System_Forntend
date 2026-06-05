import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/api';
import { formatPrice } from '../../lib/helpers';
import { PACKAGE_TYPES } from '../../lib/constants';

const emptyForm = {
  title:        '',
  description:  '',
  price:        '',
  discountPrice: 0,
  duration:     '',
  maxGuests:    10,
  packageType:  'standard',
  image:        '',
  featured:     false,
  destination:  ''
};

const AdminPackages = () => {
  const [packages,     setPackages]     = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [showForm,     setShowForm]     = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [form,         setForm]         = useState(emptyForm);
  const [search,       setSearch]       = useState('');

  const fetchAll = () => {
    API.get('/packages?limit=50').then(r => setPackages(r.data.data || []));
  };

  useEffect(() => {
    fetchAll();
    API.get('/destinations?limit=100').then(r => setDestinations(r.data.data || []));
  }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const openCreate = () => {
    setEditData(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditData(p);
    setForm({
      title:        p.title,
      description:  p.description,
      price:        p.price,
      discountPrice: p.discountPrice || 0,
      duration:     p.duration,
      maxGuests:    p.maxGuests,
      packageType:  p.packageType,
      image:        p.image,
      featured:     p.featured,
      destination:  p.destination?._id || p.destination || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.destination) delete payload.destination;

      if (editData) {
        await API.put(`/packages/${editData._id}`, payload);
        toast.success('Package updated!');
      } else {
        await API.post('/packages', payload);
        toast.success('Package created!');
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await API.delete(`/packages/${id}`);
      toast.success('Deleted!');
      fetchAll();
    } catch {
      toast.error('Delete failed!');
    }
  };

  const filtered = packages.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.layout}>
      <AdminSidebar />
      <div style={styles.main}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <h1 style={styles.heading}>Packages ({packages.length})</h1>
          <div style={styles.topActions}>
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button onClick={openCreate} style={styles.addBtn}>+ Add New</button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{ margin: '0 0 20px', color: '#1a1a2e' }}>
              {editData ? '✏️ Edit Package' : '➕ Add Package'}
            </h3>
            <form onSubmit={handleSubmit} style={styles.formGrid}>

              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Package Title *</label>
                <input
                  name="title" placeholder="Amazing Bali Adventure"
                  value={form.title} onChange={handleChange}
                  style={styles.input} required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Price (₹) *</label>
                <input
                  name="price" type="number"
                  value={form.price} onChange={handleChange}
                  style={styles.input} required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Discount Price (0 = none)</label>
                <input
                  name="discountPrice" type="number"
                  value={form.discountPrice} onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Duration *</label>
                <input
                  name="duration" placeholder="7 Days"
                  value={form.duration} onChange={handleChange}
                  style={styles.input} required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Max Guests</label>
                <input
                  name="maxGuests" type="number"
                  value={form.maxGuests} onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Package Type</label>
                <select
                  name="packageType" value={form.packageType}
                  onChange={handleChange} style={styles.input}
                >
                  {PACKAGE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* ✅ Destination Dropdown */}
              <div style={styles.field}>
                <label style={styles.label}>Destination</label>
                <select
                  name="destination" value={form.destination}
                  onChange={handleChange} style={styles.input}
                >
                  <option value="">Select Destination</option>
                  {destinations.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.name}, {d.country}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Image URL</label>
                <input
                  name="image" placeholder="https://..."
                  value={form.image} onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description" placeholder="Describe the package..."
                  value={form.description} onChange={handleChange}
                  rows={3} style={{ ...styles.input, resize: 'vertical' }}
                />
              </div>

              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox" name="featured"
                    checked={form.featured} onChange={handleChange}
                  />
                  &nbsp; Mark as Featured
                </label>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.saveBtn}>
                  {editData ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={styles.tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Destination</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Guests</th>
                <th style={styles.th}>Featured</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} style={styles.tr}>
                  <td style={styles.td}>
                    <img src={p.image} alt="" style={styles.thumb} />
                  </td>
                  <td style={styles.td}><strong>{p.title}</strong></td>
                  <td style={styles.td}>
                    {p.destination?.name
                      ? `${p.destination.name}, ${p.destination.country}`
                      : <span style={{ color: '#aaa' }}>—</span>
                    }
                  </td>
                  <td style={styles.td}>
                    {formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}
                  </td>
                  <td style={styles.td}>{p.duration}</td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>{p.packageType}</span>
                  </td>
                  <td style={styles.td}>{p.maxGuests}</td>
                  <td style={styles.td}>{p.featured ? '✅' : '—'}</td>
                  <td style={styles.td}>
                    <button onClick={() => openEdit(p)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>Delete</button>
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
  layout:      { display: 'flex', minHeight: '100vh', background: '#f4f6fa' },
  main:        { flex: 1, padding: '35px', overflowX: 'auto' },
  topBar:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' },
  heading:     { fontSize: '26px', color: '#1a1a2e', margin: 0 },
  topActions:  { display: 'flex', gap: '10px' },
  searchInput: { padding: '9px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '200px' },
  addBtn:      { background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  formCard:    { background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '25px' },
  formGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  field:       { display: 'flex', flexDirection: 'column', gap: '5px' },
  label:       { fontSize: '13px', color: '#555', fontWeight: '500' },
  checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' },
  input:       { padding: '10px 13px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  saveBtn:     { background: '#e94560', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn:   { background: '#f0f0f0', color: '#555', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: 'pointer' },
  tableWrap:   { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' },
  thead:       { background: '#1a1a2e' },
  th:          { color: '#fff', padding: '14px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '500' },
  tr:          { borderBottom: '1px solid #f5f5f5' },
  td:          { padding: '12px', fontSize: '13px', color: '#333', verticalAlign: 'middle' },
  thumb:       { width: '65px', height: '48px', objectFit: 'cover', borderRadius: '7px' },
  typeBadge:   { background: '#fce4ec', color: '#c62828', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' },
  editBtn:     { background: '#1565c0', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontSize: '12px' },
  deleteBtn:   { background: '#c62828', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
};

export default AdminPackages;