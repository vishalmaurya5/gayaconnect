import Banner from '../models/Banner.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../utils/helpers.js';

export const createBanner = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Banner image is required' });
  const upload = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, { folder: 'gaya-connect/banners' });

  const banner = await Banner.create({ ...req.body, imageUrl: upload.secure_url });
  res.status(201).json(banner);
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) return res.status(404).json({ message: 'Banner not found' });
  res.json(banner);
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) return res.status(404).json({ message: 'Banner not found' });
  res.json({ message: 'Banner deleted' });
});

export const getActiveBanners = asyncHandler(async (req, res) => {
  const now = new Date();
  const banners = await Banner.find({ isActive: true, startsAt: { $lte: now }, expiresAt: { $gte: now } }).sort('-createdAt');
  res.json(banners);
});

export const trackBannerClick = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: 'Banner not found' });
  banner.clicks += 1;
  await banner.save();
  res.json({ redirectUrl: banner.redirectUrl || null });
});
