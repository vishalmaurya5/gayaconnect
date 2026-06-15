import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
  avatar: { type: String },
  subscriptionActive: { type: Boolean, default: false },
  subscriptionExpiry: { type: Date },
  subscriptionPlan: { type: String },
  failedLoginAttempts: { type: Number, default: 0, select: false },
  lockedUntil: { type: Date, select: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isLoginLocked = function() {
  return !!(this.lockedUntil && this.lockedUntil > new Date());
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
