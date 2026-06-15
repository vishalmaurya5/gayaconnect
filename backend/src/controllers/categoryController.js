import Category from '../models/Category.js';
import { asyncHandler, slugify } from '../utils/helpers.js';

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, slug: slugify(req.body.name) });
  res.status(201).json(category);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder');
  res.json(categories);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.name) update.slug = slugify(update.name);
  const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
});
