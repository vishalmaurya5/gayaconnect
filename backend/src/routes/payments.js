import express from 'express';
import { protect } from '../middleware/auth.js';
import { createOrder, verifyPayment, webhookHandler, paymentHistory } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', webhookHandler);
router.get('/history', protect, paymentHistory);

export default router;
