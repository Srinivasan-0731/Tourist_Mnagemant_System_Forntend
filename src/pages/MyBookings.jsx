import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import API from '../api/api';
import { formatPrice, formatDate } from '../lib/helpers';
import { useAuth } from '../context/AuthContext';

const statusColor = {
  pending:   { bg: '#fff8e1', color: '#f5a623', border: '#ffe082' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  cancelled: { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' },
  completed: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [selected, setSelected] = useState(null);
  const [paying,   setPaying]   = useState(false);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my');
      const active = (res.data.data || []).filter(b => b.status !== 'cancelled');
      setBookings(active);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('✅ Booking cancelled successfully!');
      setBookings(prev => prev.filter(b => b._id !== id));
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancel failed!');
    }
  };

  const handlePayNow = async (booking) => {
    setPaying(true);
    try {
      const orderRes = await API.post('/payments/create-order', {
        bookingId: booking._id
      });
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      const options = {
        key:         keyId,
        amount,
        currency,
        name:        'TravelMS',
        description: booking.package?.title || 'Travel Package',
        order_id:    orderId,
        prefill:     { name: user?.name || '', email: user?.email || '' },
        theme:       { color: '#e94560' },
        handler: async (response) => {
          try {
            await API.post('/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              bookingId:           booking._id,
            });
            toast.success('🎉 Payment successful! Booking confirmed!');
            fetchBookings();
            setSelected(null);
          } catch {
            toast.error('Payment verification failed!');
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled!');
            setPaying(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment init failed!');
      setPaying(false);
    }
  };

  const filtered = filter
    ? bookings.filter(b => b.status === filter)
    : bookings;

  const canCancel = (status) => status === 'pending' || status === 'confirmed';

  return (
    <div style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <Navbar />

      <div style={styles.header}>
        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.sub}>View and manage your travel tickets</p>
      </div>

      <div style={styles.container}>

        <div style={styles.filterBar}>
          {['', 'pending', 'confirmed', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                ...styles.filterBtn,
                ...(filter === s ? styles.filterActive : {})
              }}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              <span style={styles.filterCount}>
                {s === '' ? bookings.length : bookings.filter(b => b.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '60px', margin: 0 }}>🎫</p>
            <h3 style={{ color: '#1a1a2e', margin: '15px 0 8px' }}>No bookings found</h3>
            <p style={{ color: '#888' }}>Book a package to see your tickets here!</p>
            <a href="/packages" style={styles.exploreBtn}>Explore Packages</a>
          </div>
        ) : (
          <div style={styles.ticketGrid}>
            {filtered.map(b => {
              const sc = statusColor[b.status] || statusColor.pending;
              const isPending    = b.status === 'pending';
              const isPayPending = b.paymentStatus === 'unpaid' || b.paymentStatus === 'pending';

              return (
                <div key={b._id} style={styles.ticket}>

                  {/* Left */}
                  <div style={styles.ticketLeft}>
                    <img
                      src={b.package?.image || 'https://placehold.co/120x120?text=Trip'}
                      alt=""
                      style={styles.ticketImg}
                      onError={e => { e.target.src = 'https://placehold.co/120x120?text=Trip'; }}
                    />
                    <span style={{
                      ...styles.statusBadge,
                      background: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.border}`
                    }}>
                      {b.status?.toUpperCase()}
                    </span>
                  </div>

                  {/* Notch */}
                  <div style={styles.notchWrap}>
                    <div style={styles.notchTop} />
                    <div style={styles.dashedLine} />
                    <div style={styles.notchBottom} />
                  </div>

                  {/* Right */}
                  <div style={styles.ticketRight}>
                    <div style={styles.ticketHeader}>
                      <h3 style={styles.ticketTitle}>{b.package?.title || 'Travel Package'}</h3>
                      <p style={styles.ticketId}>#{b.bookingId}</p>
                    </div>

                    <div style={styles.ticketInfo}>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>📅 Travel Date</span>
                        <span style={styles.infoValue}>{formatDate(b.travelDate)}</span>
                      </div>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>👥 Guests</span>
                        <span style={styles.infoValue}>{b.totalGuests} persons</span>
                      </div>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>💳 Payment</span>
                        <span style={styles.infoValue}>{b.paymentMethod}</span>
                      </div>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>💰 Total</span>
                        <span style={{
                          ...styles.infoValue,
                          color: '#e94560',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {formatPrice(b.totalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={styles.ticketActions}>

                      {/* Pay Now — pending + unpaid மட்டும் */}
                      {isPending && isPayPending && (
                        <button
                          onClick={() => handlePayNow(b)}
                          style={styles.payNowBtn}
                          disabled={paying}
                        >
                          {paying ? '⏳...' : '💳 Pay Now'}
                        </button>
                      )}

                      {/* Paid badge */}
                      {b.paymentStatus === 'paid' && (
                        <span style={styles.paidBadge}>✅ Paid</span>
                      )}

                      <div style={styles.actionBtns}>
                        {/* ✅ Cancel — pending + confirmed இரண்டிலயும் */}
                        {canCancel(b.status) && (
                          <button
                            onClick={() => handleCancel(b._id)}
                            style={styles.cancelBtn}
                          >
                            ❌ Cancel
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(b)}
                          style={styles.viewBtn}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selected && (
        <div style={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>

            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>🎫 Booking Ticket</h2>
                <p style={styles.modalSub}>TravelMS Confirmation</p>
              </div>
              <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.ticketDetail}>

              <div style={styles.detailTop}>
                <img
                  src={selected.package?.image || 'https://placehold.co/80x80?text=Trip'}
                  alt=""
                  style={styles.detailImg}
                  onError={e => { e.target.src = 'https://placehold.co/80x80?text=Trip'; }}
                />
                <div>
                  <h3 style={styles.detailPackageName}>
                    {selected.package?.title || 'Travel Package'}
                  </h3>
                  <p style={styles.detailMeta}>
                    {selected.package?.packageType?.toUpperCase() || ''}
                  </p>
                  {(() => {
                    const sc = statusColor[selected.status] || statusColor.pending;
                    return (
                      <span style={{
                        ...styles.statusBadge,
                        background: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.border}`
                      }}>
                        {selected.status?.toUpperCase()}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div style={styles.bookingIdBar}>
                <div>
                  <p style={styles.idLabel}>BOOKING ID</p>
                  <p style={styles.idValue}>{selected.bookingId}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.idLabel}>BOOKED ON</p>
                  <p style={styles.idValue}>{formatDate(selected.createdAt)}</p>
                </div>
              </div>

              <div style={styles.ticketCut}>
                <div style={styles.cutCircleLeft} />
                <div style={{ flex: 1, borderTop: '2px dashed #ddd' }} />
                <div style={styles.cutCircleRight} />
              </div>

              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <p style={styles.detailLabel}>✈️ TRAVEL DATE</p>
                  <p style={styles.detailValue}>{formatDate(selected.travelDate)}</p>
                </div>
                {selected.returnDate && (
                  <div style={styles.detailItem}>
                    <p style={styles.detailLabel}>🔙 RETURN DATE</p>
                    <p style={styles.detailValue}>{formatDate(selected.returnDate)}</p>
                  </div>
                )}
                <div style={styles.detailItem}>
                  <p style={styles.detailLabel}>👥 ADULTS</p>
                  <p style={styles.detailValue}>{selected.guests?.adults || 1}</p>
                </div>
                <div style={styles.detailItem}>
                  <p style={styles.detailLabel}>👶 CHILDREN</p>
                  <p style={styles.detailValue}>{selected.guests?.children || 0}</p>
                </div>
                <div style={styles.detailItem}>
                  <p style={styles.detailLabel}>👨‍👩‍👧 TOTAL GUESTS</p>
                  <p style={styles.detailValue}>{selected.totalGuests}</p>
                </div>
                <div style={styles.detailItem}>
                  <p style={styles.detailLabel}>💳 PAYMENT METHOD</p>
                  <p style={styles.detailValue}>{selected.paymentMethod}</p>
                </div>
                <div style={styles.detailItem}>
                  <p style={styles.detailLabel}>💰 TOTAL AMOUNT</p>
                  <p style={{ ...styles.detailValue, color: '#e94560', fontSize: '20px' }}>
                    {formatPrice(selected.totalPrice)}
                  </p>
                </div>
                <div style={styles.detailItem}>
                  <p style={styles.detailLabel}>🧾 PAYMENT STATUS</p>
                  <p style={{
                    ...styles.detailValue,
                    color: selected.paymentStatus === 'paid' ? '#2e7d32' : '#f5a623'
                  }}>
                    {selected.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </p>
                </div>
              </div>

              {selected.specialRequests && (
                <div style={styles.specialReq}>
                  <p style={styles.detailLabel}>📝 SPECIAL REQUESTS</p>
                  <p style={{ margin: '5px 0 0', color: '#555', fontSize: '14px', lineHeight: 1.6 }}>
                    {selected.specialRequests}
                  </p>
                </div>
              )}

              <div style={styles.ticketCut}>
                <div style={styles.cutCircleLeft} />
                <div style={{ flex: 1, borderTop: '2px dashed #ddd' }} />
                <div style={styles.cutCircleRight} />
              </div>

              <div style={styles.detailFooter}>
                <p style={styles.footerText}>✈️ TravelMS | Have a wonderful journey!</p>
                <p style={styles.footerSub}>support@travelms.com | +91 98765 43210</p>
              </div>

              <div style={styles.modalActions}>
                {/* Pay Now — modal-ல */}
                {selected.status === 'pending' &&
                 (selected.paymentStatus === 'unpaid' || selected.paymentStatus === 'pending') && (
                  <button
                    onClick={() => handlePayNow(selected)}
                    style={styles.modalPayBtn}
                    disabled={paying}
                  >
                    {paying ? '⏳ Processing...' : '💳 Pay Now'}
                  </button>
                )}

                {/* ✅ Cancel — pending + confirmed இரண்டிலயும் */}
                {canCancel(selected.status) && (
                  <button
                    onClick={() => handleCancel(selected._id)}
                    style={styles.cancelTicketBtn}
                  >
                    ❌ Cancel Booking
                  </button>
                )}

                <button onClick={() => window.print()} style={styles.printBtn}>
                  🖨️ Print
                </button>
                <button onClick={() => setSelected(null)} style={styles.closeTicketBtn}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const styles = {
  header:    { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: '#fff', padding: '50px 40px', textAlign: 'center' },
  title:     { fontSize: '38px', margin: '0 0 8px' },
  sub:       { color: '#ccc', fontSize: '16px', margin: 0 },
  container: { maxWidth: '1000px', margin: '30px auto', padding: '0 20px 60px' },

  filterBar:    { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
  filterBtn:    { padding: '8px 18px', borderRadius: '20px', border: '2px solid #e0e0e0', background: '#fff', color: '#555', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' },
  filterActive: { border: '2px solid #e94560', color: '#e94560', background: '#fff5f7' },
  filterCount:  { background: '#f0f0f0', color: '#666', padding: '1px 8px', borderRadius: '10px', fontSize: '12px' },

  empty:      { textAlign: 'center', padding: '60px 20px' },
  exploreBtn: { display: 'inline-block', marginTop: '15px', background: '#e94560', color: '#fff', padding: '12px 28px', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold' },

  ticketGrid: { display: 'flex', flexDirection: 'column', gap: '18px' },

  ticket: {
    display: 'flex', background: '#fff', borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
    overflow: 'hidden', border: '1px solid #f0f0f0'
  },

  ticketLeft:  { width: '130px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 15px', background: '#f8f9fa', gap: '10px', flexShrink: 0 },
  ticketImg:   { width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px' },
  statusBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },

  notchWrap:   { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', background: '#fff' },
  notchTop:    { width: '18px', height: '18px', borderRadius: '50%', background: '#f4f6fa', border: '1px solid #eee', marginTop: '-9px', flexShrink: 0 },
  notchBottom: { width: '18px', height: '18px', borderRadius: '50%', background: '#f4f6fa', border: '1px solid #eee', marginBottom: '-9px', flexShrink: 0 },
  dashedLine:  { flex: 1, borderLeft: '2px dashed #e0e0e0' },

  ticketRight:  { flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '12px' },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  ticketTitle:  { margin: 0, fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e' },
  ticketId:     { color: '#aaa', fontSize: '12px', margin: 0 },

  ticketInfo: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
  infoItem:   { display: 'flex', flexDirection: 'column', gap: '2px' },
  infoLabel:  { fontSize: '11px', color: '#aaa', margin: 0 },
  infoValue:  { fontSize: '14px', color: '#333', fontWeight: '500', margin: 0 },

  ticketActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap', gap: '8px' },
  paidBadge:     { background: '#e8f5e9', color: '#2e7d32', padding: '5px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  actionBtns:    { display: 'flex', gap: '8px', marginLeft: 'auto' },

  payNowBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  cancelBtn: { background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  viewBtn:   { background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },

  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' },
  modal:        { background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },

  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 25px', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '18px 18px 0 0' },
  modalTitle:  { color: '#fff', margin: 0, fontSize: '20px' },
  modalSub:    { color: '#aaa', margin: '3px 0 0', fontSize: '13px' },
  closeBtn:    { background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '15px' },

  ticketDetail:      { padding: '0 25px 25px' },
  detailTop:         { display: 'flex', gap: '15px', alignItems: 'center', padding: '20px 0' },
  detailImg:         { width: '75px', height: '75px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 },
  detailPackageName: { margin: '0 0 4px', fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e' },
  detailMeta:        { margin: '0 0 8px', color: '#888', fontSize: '13px' },

  bookingIdBar: { background: '#f8f9fa', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', marginBottom: '5px' },
  idLabel:      { margin: 0, fontSize: '11px', color: '#aaa', fontWeight: '600', letterSpacing: '0.5px' },
  idValue:      { margin: '4px 0 0', fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e' },

  ticketCut:      { display: 'flex', alignItems: 'center', margin: '15px -25px' },
  cutCircleLeft:  { width: '22px', height: '22px', borderRadius: '50%', background: '#f4f6fa', border: '1px solid #eee', flexShrink: 0 },
  cutCircleRight: { width: '22px', height: '22px', borderRadius: '50%', background: '#f4f6fa', border: '1px solid #eee', flexShrink: 0 },

  detailGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '15px 0' },
  detailItem:  {},
  detailLabel: { margin: 0, fontSize: '11px', color: '#aaa', fontWeight: '600', letterSpacing: '0.5px' },
  detailValue: { margin: '4px 0 0', fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },

  specialReq:   { background: '#f8f9fa', borderRadius: '10px', padding: '14px', margin: '10px 0' },
  detailFooter: { textAlign: 'center', padding: '10px 0' },
  footerText:   { margin: 0, color: '#1a1a2e', fontWeight: 'bold', fontSize: '14px' },
  footerSub:    { margin: '4px 0 0', color: '#aaa', fontSize: '12px' },

  modalActions:    { display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' },
  modalPayBtn:     { flex: 1, padding: '11px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  cancelTicketBtn: { flex: 1, padding: '11px', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  printBtn:        { flex: 1, padding: '11px', background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  closeTicketBtn:  { flex: 1, padding: '11px', background: '#f0f0f0', color: '#555', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
};

export default MyBookings;