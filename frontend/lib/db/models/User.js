import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false, required: true },
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
  profileImage: { type: String },
  subscriptionActive: { type: Boolean, default: false },
  subscriptionExpiry: { type: Date },
  subscriptionPlan: { type: String },
  // Vendor Fields
  businessName: { type: String },
  category: { type: String },
  subCategory: { type: String },
  address: { type: String },
  gstNumber: { type: String },
  description: { type: String },
  verified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

delete mongoose.models.User;
const User = mongoose.model('User', userSchema);
export default User;
