import express from 'express';
import { 
  createPayment, getPayments, getPaymentById, updatePaymentStatus, deletePayment,
  getInvoices, getInvoiceById,
  getPricing, updatePricing, createPricing,
  getFinanceStats
} from '../controllers/financeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(admin);

// Dashboard
router.get('/stats', getFinanceStats);

// Payments
router.route('/payments')
  .get(getPayments)
  .post(createPayment);

router.route('/payments/:id')
  .get(getPaymentById)
  .put(updatePaymentStatus)
  .delete(deletePayment);

// Invoices
router.route('/invoices')
  .get(getInvoices);
router.route('/invoices/:id')
  .get(getInvoiceById);

// Pricing
router.route('/pricing')
  .get(getPricing)
  .post(createPricing);
router.route('/pricing/:id')
  .put(updatePricing);

export default router;
