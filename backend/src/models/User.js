import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
  avatar: { type: String },
  // Account state
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  // Auth tokens / secrets (never returned unless explicitly selected)
  refreshToken: { type: String, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
  emailVerificationToken: { type: String, select: false },
  // Contact-access / subscription
  contactAccessExpiresAt: { type: Date },
  subscriptionActive: { type: Boolean, default: false },
  subscriptionExpiry: { type: Date },
  subscriptionPlan: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password only when it is set/changed. Always keep updatedAt fresh.
// Async hook: no `next` — Mongoose awaits the returned promise.
userSchema.pre('save', async function () {
  this.updatedAt = Date.now();
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password compare — expose both names so all callers work.
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.matchPassword = userSchema.methods.comparePassword;

// Short-lived access token.
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );
};

// Long-lived refresh token (stored on the user, rotated on logout).
userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

// Forgot-password: returns the raw token (emailed to user); stores only its hash.
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

// Email verification: returns raw token, stores only its hash.
userSchema.methods.getEmailVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  return verifyToken;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
