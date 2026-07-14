import express from 'express';
import { protect, optionalProtect, authorize } from '../middleware/auth.js';
import { cacheResponse } from '../middleware/cache.js';
import {
  createVendor,
  updateVendor,
  deleteVendor,
  getVendors,
  getVendorBySlug,
  nearbyVendors,
  approveVendor,
  rejectVendor,
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/', optionalProtect, cacheResponse('vendors', 600), getVendors);
router.get('/nearby', optionalProtect, nearbyVendors);
router.get('/:slug', optionalProtect, cacheResponse('vendor-slug', 600), getVendorBySlug);
router.post('/', protect, authorize('vendor', 'admin'), createVendor);
router.put('/:id', protect, authorize('vendor', 'admin'), updateVendor);
router.delete('/:id', protect, authorize('admin'), deleteVendor);
router.patch('/:id/approve', protect, authorize('admin'), approveVendor);
router.patch('/:id/reject', protect, authorize('admin'), rejectVendor);

export default router;
