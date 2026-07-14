import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

categorySchema.index({ name: 1, isActive: 1 });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
