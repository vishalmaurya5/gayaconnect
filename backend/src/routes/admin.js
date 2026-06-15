import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { dashboardStats, userManagement, toggleUserStatus, revenueAnalytics, getAllBookings, deleteBooking, getAllReviews } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', dashboardStats);
router.get('/users', userManagement);
router.patch('/users/:id/toggle', toggleUserStatus);
router.get('/revenue', revenueAnalytics);
router.get('/bookings', getAllBookings);
router.delete('/bookings/:id', deleteBooking);
router.get('/reviews', getAllReviews);

export default router;
