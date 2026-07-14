import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true, sparse: true },
  password: { type: String, select: false, required: true },
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
  adminRole: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'NONE'], default: 'NONE' },
  assignedCities: [{ type: String }],
  permissions: [{ type: String }],
  profileImage: { type: String },
  subscriptionActive: { type: Boolean, default: false },
  subscriptionExpiry: { type: Date },
  subscriptionPlan: { type: String },
  // Vendor Fields
  regCode: { type: String },
  businessName: { type: String },
  category: { type: String },
  subCategory: { type: String },
  address: { type: String },
  gstNumber: { type: String },
  description: { type: String },
  verified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  // Password reset (forgot-password flow) — stored hashed, never returned by default
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
  refreshTokenHash: { type: String, select: false },
  refreshTokenExpiresAt: { type: Date, select: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

delete mongoose.models.User;
const User = mongoose.model('User', userSchema);
export default User;
