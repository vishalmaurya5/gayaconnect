import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { cacheResponse } from '../middleware/cache.js';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', cacheResponse('categories', 86400), getCategories); // Cache for 24h since categories rarely change
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
