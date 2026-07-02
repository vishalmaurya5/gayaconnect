import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  is_default: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_by_role: { type: String, enum: ['user', 'vendor', 'admin'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
