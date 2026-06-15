import { protect, authorize } from './auth.js';

export const adminOnly = [protect, authorize('admin')];
