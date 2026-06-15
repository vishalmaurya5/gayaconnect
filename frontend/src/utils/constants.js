export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const SUBSCRIPTION_PLANS = [
  { id: 'monthly', name: 'Monthly Premium', price: 999, period: 'month' },
  { id: 'yearly', name: 'Yearly Premium', price: 9999, period: 'year' },
];

export const BANNER_PACKAGES = [
  { id: 'weekly', name: 'Weekly Banner', price: 500 },
  { id: 'monthly', name: 'Monthly Banner', price: 1500 },
];

export const LEAD_CREDIT_PACK = { leads: 100, price: 500 };
export const REPAIR_COMMISSION_PERCENT = 15;

export const CITIES = ['Gaya', 'Bodh Gaya', 'Patna'];

export const CATEGORIES = [
  'Plumber', 'Electrician', 'Salon', 'Tuition', 'Hotel', 'Restaurant', 'Doctor', 'Bike Repair',
];
