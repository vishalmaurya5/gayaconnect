import crypto from 'crypto';
import User from '../models/User.js';
import { asyncHandler } from '../utils/helpers.js';
import { sendEmail } from '../utils/sendEmail.js';
import { toAuthUser } from '../utils/contactAccess.js';

const sendAuth = async (user, res) => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();
  res.json({ token, refreshToken, user: toAuthUser(user) });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const user = await User.create({ name, email, password, phone, role: role || 'user' });
  const verifyToken = user.getEmailVerificationToken();
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  await sendEmail({ to: user.email, subject: 'Verify your account', html: `<p>Verify account: <a href="${verifyUrl}">${verifyUrl}</a></p>` });

  await sendAuth(user, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  await sendAuth(user, res);
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

  const token = user.getSignedJwtToken();
  res.json({ token });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({ to: user.email, subject: 'Reset password', html: `<p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p>` });

  res.json({ message: 'Reset email sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: tokenHash, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await sendAuth(user, res);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ emailVerificationToken: tokenHash });
  if (!user) return res.status(400).json({ message: 'Invalid token' });

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully' });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshToken = null;
    await req.user.save();
  }
  res.json({ message: 'Logged out' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;
  const user = await User.findById(req.user.id);

  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    user.email = email;
    user.isEmailVerified = false; // Re-verify if email changed
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;

  await user.save();
  res.json(user);
});
