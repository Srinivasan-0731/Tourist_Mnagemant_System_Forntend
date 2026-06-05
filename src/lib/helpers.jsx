// Date format: 15 Jun 2025
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

// Price format: ₹1,25,000
export const formatPrice = (price) => {
  if (!price && price !== 0) return '-';
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

// Get final price (discount or original)
export const getFinalPrice = (price, discountPrice) => {
  return discountPrice > 0 ? discountPrice : price;
};

// Calculate total booking price
export const calcTotalPrice = (price, discountPrice, adults = 1, children = 0) => {
  const finalPrice = getFinalPrice(price, discountPrice);
  return finalPrice * (adults + children);
};

// Truncate long text
export const truncate = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    pending:   '#f5a623',
    confirmed: '#2e7d32',
    cancelled: '#c62828',
    completed: '#1565c0',
    unpaid:    '#888888',
    paid:      '#2e7d32',
    refunded:  '#f5a623',
    active:    '#2e7d32',
    inactive:  '#888888',
    admin:     '#e94560',
    user:      '#1565c0',
  };
  return colors[status] || '#888';
};

// Get token
export const getToken = () => localStorage.getItem('token');

// Get stored user
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Check admin
export const isAdmin = (user) => user?.role === 'admin';

// Render star rating
export const renderStars = (rating) => {
  const rounded = Math.round(rating || 0);
  return '⭐'.repeat(rounded);
};

// Format number with commas
export const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('en-IN');
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};