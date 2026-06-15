import express from 'express';
import upload from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';
import { createBanner, updateBanner, deleteBanner, trackBannerClick, getActiveBanners } from '../controllers/bannerController.js';

const router = express.Router();

router.get('/active', getActiveBanners);
router.post('/', protect, authorize('admin', 'vendor'), upload.single('image'), createBanner);
router.put('/:id', protect, authorize('admin', 'vendor'), updateBanner);
router.delete('/:id', protect, authorize('admin', 'vendor'), deleteBanner);
router.post('/:id/click', trackBannerClick);

export default router;
