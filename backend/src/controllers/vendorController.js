import Vendor from '../models/Vendor.js';
import Review from '../models/Review.js';
import { asyncHandler, slugify } from '../utils/helpers.js';
import { hasActiveContactAccess, redactVendorContact } from '../utils/contactAccess.js';
import { clearCache } from '../middleware/cache.js';

export const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ $or: [{ user: req.user._id }, { userId: req.user._id }] });
  if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
  res.json(vendor);
});

export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.create({ ...req.body, user: req.user._id, slug: slugify(req.body.businessName) });
  await clearCache('vendors');
  res.status(201).json(vendor);
});

export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  if (String(vendor.user) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  Object.assign(vendor, req.body);
  await vendor.save();
  await clearCache('vendors');
  await clearCache('vendor-slug');
  res.json(vendor);
});

export const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  await clearCache('vendors');
  await clearCache('vendor-slug');
  res.json({ message: 'Vendor deleted' });
});

export const getVendors = asyncHandler(async (req, res) => {
  const { q, category, subCategory, city, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const filter = { isApproved: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
  if (subCategory) filter.subCategory = { $regex: `^${escapeRegex(subCategory)}$`, $options: 'i' };
  if (city) filter.city = city;

  const vendors = await Vendor.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Vendor.countDocuments(filter);
  const canViewContact = hasActiveContactAccess(req.user);
  res.json({
    data: vendors.map((vendor) => redactVendorContact(vendor, canViewContact)),
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    contactAccess: {
      hasAccess: Boolean(canViewContact),
      expiresAt: req.user?.contactAccessExpiresAt || null,
      price: 9,
      period: 'year',
    },
  });
});

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getVendorBySlug = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

  vendor.views += 1;
  await vendor.save();

  const reviews = await Review.find({ vendor: vendor._id }).populate('user', 'name');
  const canViewContact = hasActiveContactAccess(req.user);
  res.json({
    vendor: redactVendorContact(vendor, canViewContact),
    reviews,
    contactAccess: {
      hasAccess: Boolean(canViewContact),
      expiresAt: req.user?.contactAccessExpiresAt || null,
      price: 9,
      period: 'year',
    },
  });
});

export const nearbyVendors = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query;
  const vendors = await Vendor.find({
    isApproved: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(maxDistance),
      },
    },
  }).limit(20);
  const canViewContact = hasActiveContactAccess(req.user);
  res.json(vendors.map((vendor) => redactVendorContact(vendor, canViewContact)));
});

export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isApproved: true, isRejected: false, rejectionReason: null }, { new: true });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  await clearCache('vendors');
  await clearCache('vendor-slug');
  res.json(vendor);
});

export const rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isApproved: false, isRejected: true, rejectionReason: req.body.reason || 'Policy mismatch' }, { new: true });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  await clearCache('vendors');
  await clearCache('vendor-slug');
  res.json(vendor);
});
