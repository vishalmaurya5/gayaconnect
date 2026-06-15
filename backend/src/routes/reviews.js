import express from 'express';
import { protect } from '../middleware/auth.js';
import { createReview, deleteReview, getMyReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.use(protect);

router.post('/', createReview);
router.delete('/:id', deleteReview);
router.get('/my', getMyReviews);

export default router;
