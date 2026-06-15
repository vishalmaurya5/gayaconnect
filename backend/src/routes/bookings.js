import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { createBooking, updateBookingStatus, cancelBooking, getUserBookings, getVendorBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', protect, authorize('user', 'admin'), createBooking);
router.get('/my', protect, authorize('user', 'admin'), getUserBookings);
router.get('/vendor', protect, authorize('vendor', 'admin'), getVendorBookings);
router.patch('/:id/status', protect, authorize('vendor', 'admin'), updateBookingStatus);
router.patch('/:id/cancel', protect, authorize('user', 'admin'), cancelBooking);

export default router;
