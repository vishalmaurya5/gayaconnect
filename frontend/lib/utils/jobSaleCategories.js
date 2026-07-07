// Shared category list for Jobs & Sales postings (public marketplace).
// Used by the vendor post form, admin post form, the API, and the public
// jobs-and-sales page so categories stay consistent everywhere.

export const JOB_SALE_CATEGORIES = [
  'Electronics & Appliances',
  'Mobiles & Accessories',
  'Vehicles (Car / Bike / Auto)',
  'Furniture & Home Decor',
  'Property & Real Estate',
  'Clothing & Fashion',
  'Books & Stationery',
  'Agriculture & Farming',
  'Pets & Livestock',
  'Business & Equipment',
  'Jobs & Staff',
  'Services',
  'Other',
];

// Safe fallback used when a posting has no category set yet.
export const DEFAULT_JOB_SALE_CATEGORY = 'Other';

export const isValidJobSaleCategory = (value) =>
  JOB_SALE_CATEGORIES.includes(String(value || '').trim());
