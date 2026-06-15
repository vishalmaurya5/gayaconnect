import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { createNeed, getNeeds, approveNeed, deleteNeed } from '../controllers/communityController.js';

const router = express.Router();

router.get('/', protect, getNeeds);
router.post('/', protect, authorize('user', 'admin'), createNeed);
router.patch('/:id/approve', protect, authorize('admin'), approveNeed);
router.delete('/:id', protect, authorize('admin'), deleteNeed);

export default router;
