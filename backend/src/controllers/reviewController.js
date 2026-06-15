import Review from '../models/Review.js';
import Vendor from '../models/Vendor.js';
import { asyncHandler } from '../utils/helpers.js';

export const createReview = asyncHandler(async (req, res) => {
  const { vendor, rating, comment } = req.body;
  const vendorExists = await Vendor.findById(vendor);
  if (!vendorExists) return res.status(404).json({ message: 'Vendor not found' });

  const review = await Review.create({
    user: req.user._id,
    vendor,
    rating,
    comment,
  });

  res.status(201).json(review);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (String(review.user) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id }).populate('vendor', 'businessName slug');
  res.json(reviews);
});
