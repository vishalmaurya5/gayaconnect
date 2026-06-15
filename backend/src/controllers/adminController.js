import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../utils/helpers.js';

export const dashboardStats = asyncHandler(async (req, res) => {
  const [users, vendors, bookings, payments] = await Promise.all([
    User.countDocuments(),
    Vendor.countDocuments(),
    Booking.countDocuments(),
    Payment.countDocuments({ status: 'paid' }),
  ]);

  const revenueAgg = await Payment.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const recentBookings = await Booking.find().populate('user', 'name').populate('vendor', 'businessName').sort('-createdAt').limit(5);
  res.json({ users, vendors, bookings, paidTransactions: payments, revenue: revenueAgg[0]?.total || 0, recentBookings });
});

export const userManagement = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json(user);
});

export const revenueAnalytics = asyncHandler(async (req, res) => {
  const data = await Payment.aggregate([
    { $match: { status: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json(data);
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate('user', 'name').populate('vendor', 'businessName').sort('-createdAt');
  res.json(bookings);
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json({ message: 'Booking deleted' });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user', 'name').populate('vendor', 'businessName').sort('-createdAt');
  res.json(reviews);
});
