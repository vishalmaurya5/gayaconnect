import Booking from '../models/Booking.js';
import Vendor from '../models/Vendor.js';
import { asyncHandler } from '../utils/helpers.js';

export const createBooking = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.body.vendor);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

  const booking = await Booking.create({
    ...req.body,
    user: req.user._id,
    commissionAmount: Math.round((Number(req.body.servicePrice || 0) * 0.15) * 100) / 100,
  });
  res.status(201).json(booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('vendor');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const vendorUserId = booking.vendor?.user?.toString?.() || null;
  if (req.user.role !== 'admin' && vendorUserId !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  booking.status = req.body.status;
  await booking.save();
  res.json(booking);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('vendor', 'businessName slug contactNumber').sort('-createdAt');
  res.json(bookings);
});

export const getVendorBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate({ path: 'vendor', match: { user: req.user._id } }).populate('user', 'name phone');
  res.json(bookings.filter((item) => item.vendor));
});
