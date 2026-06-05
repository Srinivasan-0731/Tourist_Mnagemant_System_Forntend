import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import API from '../api/api';
import { formatPrice, calcTotalPrice } from '../lib/helpers';
import { useAuth } from '../context/AuthContext';

const formatDuration = (d) => {
  if (!d) return '';
  if (typeof d === 'string') return d;
  if (d.days && d.nights) return `${d.days}D / ${d.nights}N`;
  if (d.days) return `${d.days} Days`;
  return '';
};

const BookingPage = () => {
  const { packageId } = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();

  const [pkg,        setPkg]        = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    travelDate:      '',
    returnDate:      '',
    guests:          { adults: 1, children: 0, infants: 0 },
    specialRequests: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book!');
      navigate('/login');
      return;
    }
    API.get(`/packages/${packageId}`)
      .then(r => setPkg(r.data.data))
      .catch(() => toast.error('Package not found!'))
      .finally(() => setLoading(false));
  }, [packageId, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRazorpay = async (bookingId) => {
    try {
      const orderRes = await API.post('/payments/create-order', { bookingId });
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      const options = {
        key:         keyId,
        amount,
        currency,
        name:        'TravelMS',
        description: pkg.title,
        order_id:    orderId,
        prefill:     { name: user?.name || '', email: user?.email || '' },
        theme:       { color: '#e94560' },
        handler: async (response) => {
          try {
            await API.post('/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              bookingId,
            });
            toast.success('🎉 Payment successful! Booking confirmed!');
            navigate('/my-bookings');
          } catch {
            toast.error('Payment verification failed!');
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await API.post('/payments/failed', { bookingId }).catch(() => {});
            toast.error('Payment cancelled!');
            setSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (response) => {
        await API.post('/payments/failed', { bookingId }).catch(() => {});
        toast.error(`Payment failed: ${response.error.description}`);
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      // ✅ Backend error message show — amount exceeds போன்றவை
      toast.error(err.response?.data?.error || 'Payment init failed!');
      setSubmitting(false);
    }
  };

  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!form.travelDate) { toast.error('Please select travel date'); return; }
    setSubmitting(true);

    try {
      const bookingRes = await API.post('/bookings', {
        packageId,
        travelDate:      form.travelDate,
        returnDate:      form.returnDate,
        guests:          form.guests,
        paymentMethod:   'razorpay',
        specialRequests: form.specialRequests,
      });
      const bookingId = bookingRes.data.data._id;
      await handleRazorpay(bookingId);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired! Please login again.');
        navigate('/login');
      } else {
        toast.error(err.response?.data?.error || 'Booking failed!');
      }
      setSubmitting(false);
    }
  };

  const handlePayLater = async () => {
    if (!form.travelDate) { toast.error('Please select travel date'); return; }
    setSubmitting(true);

    try {
      await API.post('/bookings', {
        packageId,
        travelDate:      form.travelDate,
        returnDate:      form.returnDate,
        guests:          form.guests,
        paymentMethod:   'cash',
        specialRequests: form.specialRequests,
      });
      toast.success('✅ Booking confirmed! Pay before travel date.');
      navigate('/my-bookings');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired! Please login again.');
        navigate('/login');
      } else {
        toast.error(err.response?.data?.error || 'Booking failed!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <><Navbar /><Loader /></>;
  if (!pkg)    return <><Navbar /><p style={{ textAlign: 'center', padding: '80px' }}>Package not found.</p></>;

  const finalPrice = pkg.discountPrice > 0 ? pkg.discountPrice : pkg.price;
  const totalPrice = calcTotalPrice(
    pkg.price, pkg.discountPrice,
    form.guests.adults, form.guests.children
  );

  return (
    <div style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <p style={styles.breadcrumb}>Packages → {pkg.title} → Booking</p>
          <h1 style={styles.headerTitle}>{pkg.title}</h1>
          <div style={styles.headerMeta}>
            <span style={styles.metaBadge}>⏱ {formatDuration(pkg.duration)}</span>
            <span style={styles.metaBadge}>👥 Max {pkg.maxGuests} guests</span>
            <span style={styles.metaBadge}>📦 {pkg.packageType}</span>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.left}>

          {/* Step 1 */}
          <div style={styles.card}>
            <div style={styles.stepHeader}>
              <div style={styles.stepNum}>1</div>
              <h3 style={styles.stepTitle}>Select Travel Dates</h3>
            </div>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Travel Date *</label>
                <input
                  type="date" name="travelDate" value={form.travelDate}
                  onChange={handleChange} style={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Return Date</label>
                <input
                  type="date" name="returnDate" value={form.returnDate}
                  onChange={handleChange} style={styles.input}
                  min={form.travelDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={styles.card}>
            <div style={styles.stepHeader}>
              <div style={styles.stepNum}>2</div>
              <h3 style={styles.stepTitle}>Select Guests</h3>
            </div>
            <div style={styles.guestGrid}>
              {[
                { key: 'adults',   label: 'Adults',   sub: 'Age 13+',  min: 1 },
                { key: 'children', label: 'Children', sub: 'Age 2-12', min: 0 },
                { key: 'infants',  label: 'Infants',  sub: 'Below 2',  min: 0 },
              ].map(g => (
                <div key={g.key} style={styles.guestBox}>
                  <div>
                    <p style={styles.guestLabel}>{g.label}</p>
                    <p style={styles.guestSub}>{g.sub}</p>
                  </div>
                  <div style={styles.counter}>
                    <button type="button" style={styles.counterBtn}
                      onClick={() => form.guests[g.key] > g.min && setForm({
                        ...form,
                        guests: { ...form.guests, [g.key]: form.guests[g.key] - 1 }
                      })}>−</button>
                    <span style={styles.counterVal}>{form.guests[g.key]}</span>
                    <button type="button" style={styles.counterBtn}
                      onClick={() => setForm({
                        ...form,
                        guests: { ...form.guests, [g.key]: form.guests[g.key] + 1 }
                      })}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div style={styles.card}>
            <div style={styles.stepHeader}>
              <div style={styles.stepNum}>3</div>
              <h3 style={styles.stepTitle}>Special Requests</h3>
            </div>
            <div style={styles.requestTags}>
              {[
                'Vegetarian food', 'Non-smoking room',
                'Wheelchair access', 'Honeymoon setup',
                'Airport pickup', 'Early check-in',
                'Child-friendly', 'Anniversary cake',
              ].map(tag => (
                <span key={tag}
                  onClick={() => setForm({
                    ...form,
                    specialRequests: form.specialRequests
                      ? form.specialRequests + ', ' + tag
                      : tag
                  })}
                  style={styles.requestTag}
                >
                  + {tag}
                </span>
              ))}
            </div>
            <textarea
              name="specialRequests" value={form.specialRequests}
              onChange={handleChange}
              placeholder="Type your special requests or click tags above..."
              rows={3}
              style={{ ...styles.input, resize: 'vertical', width: '100%', marginTop: '12px' }}
            />
          </div>

          {/* Step 4 */}
          <div style={styles.card}>
            <div style={styles.stepHeader}>
              <div style={styles.stepNum}>4</div>
              <h3 style={styles.stepTitle}>Payment</h3>
            </div>

            <div style={styles.razorpayBox}>
              <div>
                <p style={styles.razorpayTitle}>💳 Pay via Razorpay</p>
                <p style={styles.razorpayDesc}>
                  UPI • Credit/Debit Card • Net Banking • Wallets
                </p>
              </div>
              <span style={styles.razorpayBadge}>🔒 Secure</span>
            </div>

            <div style={styles.payLaterBox}>
              <p style={styles.payLaterTitle}>🕐 Book Now, Pay Later</p>
              <p style={styles.payLaterDesc}>
                Confirm your booking now and pay at our office before travel date.
                Full payment required 24 hours before departure.
              </p>
            </div>

            {/* ✅ Amount warning */}
            {totalPrice > 500000 && (
              <div style={styles.warningBox}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#e65100' }}>
                  ⚠️ Amount Exceeds Razorpay Test Limit
                </p>
                <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#555' }}>
                  Total ₹{totalPrice.toLocaleString('en-IN')} exceeds ₹5,00,000 test limit.
                  Please reduce guests or use "Book Now, Pay Later".
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={styles.btnStack}>
            <button
              type="button"
              onClick={handlePayLater}
              style={styles.payLaterBtn}
              disabled={submitting}
            >
              {submitting ? '⏳ Processing...' : '🕐 Book Now, Pay Later'}
            </button>
            <button
              type="button"
              onClick={handleBookNow}
              style={{
                ...styles.bookNowBtn,
                ...(totalPrice > 500000 ? styles.bookNowDisabled : {})
              }}
              disabled={submitting || totalPrice > 500000}
            >
              {submitting
                ? '⏳ Processing...'
                : totalPrice > 500000
                  ? '⚠️ Amount Too Large for Online Payment'
                  : `💳 Book Now & Pay — ${formatPrice(totalPrice)}`
              }
            </button>
          </div>

        </div>

        {/* Right Summary */}
        <div style={styles.right}>
          <div style={styles.summaryCard}>
            <img
              src={pkg.image || 'https://placehold.co/400x200?text=No+Image'}
              alt={pkg.title}
              style={styles.summaryImg}
              onError={e => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }}
            />
            <div style={styles.summaryBody}>
              <h3 style={styles.summaryTitle}>{pkg.title}</h3>
              <p style={styles.summaryMeta}>
                ⏱ {formatDuration(pkg.duration)} &nbsp;|&nbsp; {pkg.packageType}
              </p>

              <div style={styles.divider} />

              <div style={styles.summaryRow}>
                <span>Price / person</span>
                <span>{formatPrice(finalPrice)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Adults × {form.guests.adults}</span>
                <span>{formatPrice(finalPrice * form.guests.adults)}</span>
              </div>
              {form.guests.children > 0 && (
                <div style={styles.summaryRow}>
                  <span>Children × {form.guests.children}</span>
                  <span>{formatPrice(finalPrice * form.guests.children)}</span>
                </div>
              )}

              <div style={styles.divider} />

              <div style={{ ...styles.summaryRow, fontWeight: 'bold', fontSize: '20px' }}>
                <span>Total</span>
                <span style={{ color: totalPrice > 500000 ? '#e65100' : '#e94560' }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {totalPrice > 500000 && (
                <p style={{ color: '#e65100', fontSize: '12px', margin: '8px 0 0', textAlign: 'center' }}>
                  ⚠️ Exceeds ₹5L test limit
                </p>
              )}

              <div style={styles.secureBox}>
                <span>🔒 100% Secure Booking</span>
                <span>✅ Instant Confirmation</span>
                <span>📞 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  header:        { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: '#fff', padding: '40px' },
  headerContent: { maxWidth: '1100px', margin: '0 auto' },
  breadcrumb:    { color: '#aaa', fontSize: '13px', margin: '0 0 10px' },
  headerTitle:   { fontSize: '32px', margin: '0 0 12px', fontWeight: 'bold' },
  headerMeta:    { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  metaBadge:     { background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px' },

  container: { display: 'flex', gap: '25px', padding: '30px 40px', maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap' },
  left:      { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },
  right:     { width: '310px' },

  card:       { background: '#fff', borderRadius: '14px', padding: '25px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  stepHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  stepNum:    { width: '32px', height: '32px', borderRadius: '50%', background: '#e94560', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px', flexShrink: 0 },
  stepTitle:  { fontSize: '17px', color: '#1a1a2e', margin: 0, fontWeight: 'bold' },

  row:   { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  field: { flex: 1, minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#555', fontWeight: '500' },
  input: { padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' },

  guestGrid:  { display: 'flex', flexDirection: 'column', gap: '5px' },
  guestBox:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #f5f5f5' },
  guestLabel: { margin: 0, fontWeight: '600', color: '#1a1a2e', fontSize: '15px' },
  guestSub:   { margin: 0, color: '#aaa', fontSize: '12px' },
  counter:    { display: 'flex', alignItems: 'center', gap: '15px' },
  counterBtn: { width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #e94560', background: '#fff', color: '#e94560', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', lineHeight: 1 },
  counterVal: { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', minWidth: '24px', textAlign: 'center' },

  requestTags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  requestTag:  { background: '#f0f4f8', color: '#1565c0', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: '1px solid #dde3ea' },

  razorpayBox:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff5f7', border: '2px solid #e94560', borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' },
  razorpayTitle: { margin: '0 0 4px', fontWeight: 'bold', color: '#e94560', fontSize: '15px' },
  razorpayDesc:  { margin: 0, color: '#888', fontSize: '13px' },
  razorpayBadge: { background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },

  payLaterBox:   { background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' },
  payLaterTitle: { margin: '0 0 6px', fontWeight: 'bold', color: '#1565c0', fontSize: '15px' },
  payLaterDesc:  { margin: 0, color: '#555', fontSize: '13px', lineHeight: 1.6 },

  warningBox: { background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '12px', padding: '15px 18px' },

  btnStack: { display: 'flex', flexDirection: 'column', gap: '12px' },
  payLaterBtn: {
    width: '100%', padding: '16px',
    background: '#fff', color: '#1565c0',
    border: '2px solid #1565c0', borderRadius: '12px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
  },
  bookNowBtn: {
    width: '100%', padding: '16px',
    background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
  },
  bookNowDisabled: {
    background: '#ccc', cursor: 'not-allowed'
  },

  summaryCard:  { background: '#fff', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'sticky', top: '20px' },
  summaryImg:   { width: '100%', height: '180px', objectFit: 'cover' },
  summaryBody:  { padding: '20px' },
  summaryTitle: { margin: '0 0 5px', color: '#1a1a2e', fontSize: '17px', fontWeight: 'bold' },
  summaryMeta:  { color: '#888', fontSize: '13px', margin: '0 0 5px' },
  divider:      { height: '1px', background: '#f0f0f0', margin: '12px 0' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px', color: '#555' },
  secureBox:    { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '15px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '12px', color: '#666' },
};

export default BookingPage;