import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  description: { type: String },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  images: [{ type: String }],
  isPremium: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  totalReviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
export default Vendor;
