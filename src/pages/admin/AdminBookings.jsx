import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/api';
import { formatPrice, formatDate, getStatusColor } from '../../lib/helpers';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus]     = useState('');
  const [loading, setLoading]   = useState(true);

  const fetchAll = () => {
    let url = '/bookings?limit=100';
    if (status) url += `&status=${status}`;
    API.get(url)
      .then(r => setBookings(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [status]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/bookings/${id}/status`, { status: newStatus });
      toast.success('Status updated!');
      fetchAll();
    } catch {
      toast.error('Update failed!');
    }
  };

  return (
    <div style={styles.layout}>
      <AdminSidebar />
      <div style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>Bookings ({bookings.length})</h1>
          <select value={status} onChange={e => setStatus(e.target.value)} style={styles.filter}>
            <option value="">All Status</option>
            {['pending', 'confirmed', 'cancelled', 'completed'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div style={styles.tableWrap}>
          {loading ? <p style={{ padding: '20px' }}>Loading...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Booking ID</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Package</th>
                  <th style={styles.th}>Travel Date</th>
                  <th style={styles.th}>Guests</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id} style={styles.tr}>
                    <td style={styles.td}><strong>{b.bookingId}</strong></td>
                    <td style={styles.td}>
                      <p style={{ margin: '0', fontWeight: '500' }}>{b.user?.name}</p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#888' }}>{b.user?.email}</p>
                    </td>
                    <td style={styles.td}>{b.package?.title}</td>
                    <td style={styles.td}>{formatDate(b.travelDate)}</td>
                    <td style={styles.td}>{b.totalGuests}</td>
                    <td style={styles.td}><strong>{formatPrice(b.totalPrice)}</strong></td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: getStatusColor(b.status) }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: getStatusColor(b.paymentStatus) }}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select
                        onChange={e => handleStatusUpdate(b._id, e.target.value)}
                        defaultValue="" style={styles.actionSelect}>
                        <option value="" disabled>Change</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  heading: { fontSize: '26px', color: '#1a1a2e', margin: 0 },
  filter: { padding: '9px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  tableWrap: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' },
  thead: { background: '#1a1a2e' },
  th: { color: '#fff', padding: '14px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '500' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px', fontSize: '13px', color: '#333', verticalAlign: 'middle' },
  badge: { color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },
  actionSelect: { padding: '7px 10px', borderRadius: '7px', border: '1px solid #ddd', fontSize: '13px', cursor: 'pointer' },
};

export default AdminBookings;