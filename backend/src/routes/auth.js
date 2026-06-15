import express from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.js';
import { register, login, logout, forgotPassword, resetPassword, verifyEmail, refresh, getMe, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
