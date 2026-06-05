export const API_BASE_URL = 'http://localhost:3000/api';

export const CATEGORIES = [
  { value: 'beach',     label: 'Beach' },
  { value: 'mountain',  label: 'Mountain' },
  { value: 'city',      label: 'City' },
  { value: 'cultural',  label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wildlife',  label: 'Wildlife' },
];

export const PACKAGE_TYPES = [
  { value: 'budget',   label: 'Budget' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium',  label: 'Premium' },
  { value: 'luxury',   label: 'Luxury' },
];

export const PAYMENT_METHODS = [
  { value: 'cash',       label: 'Cash' },
  { value: 'card',       label: 'Card' },
  { value: 'upi',        label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
];

export const BOOKING_STATUS = [
  { value: 'pending',   label: 'Pending',   color: '#f5a623' },
  { value: 'confirmed', label: 'Confirmed', color: '#2e7d32' },
  { value: 'cancelled', label: 'Cancelled', color: '#c62828' },
  { value: 'completed', label: 'Completed', color: '#1565c0' },
];

export const PAYMENT_STATUS = [
  { value: 'unpaid',   label: 'Unpaid',   color: '#888' },
  { value: 'paid',     label: 'Paid',     color: '#2e7d32' },
  { value: 'refunded', label: 'Refunded', color: '#f5a623' },
];