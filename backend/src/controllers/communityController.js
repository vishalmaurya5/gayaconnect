import CommunityNeed from '../models/CommunityNeed.js';
import { asyncHandler } from '../utils/helpers.js';

export const createNeed = asyncHandler(async (req, res) => {
  const need = await CommunityNeed.create({ ...req.body, user: req.user._id });
  res.status(201).json(need);
});

export const getNeeds = asyncHandler(async (req, res) => {
  const q = req.query.q;
  const filter = { status: 'approved' };
  if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];

  const needs = await CommunityNeed.find(req.user?.role === 'admin' ? {} : filter).populate('user', 'name').sort('-createdAt');
  res.json(needs);
});

export const approveNeed = asyncHandler(async (req, res) => {
  const need = await CommunityNeed.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
  if (!need) return res.status(404).json({ message: 'Need not found' });
  res.json(need);
});

export const deleteNeed = asyncHandler(async (req, res) => {
  const need = await CommunityNeed.findByIdAndDelete(req.params.id);
  if (!need) return res.status(404).json({ message: 'Need not found' });
  res.json({ message: 'Need deleted' });
});
