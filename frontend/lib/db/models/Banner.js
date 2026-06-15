import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String },
  position: { type: String, enum: ['home_top', 'home_middle', 'category_top', 'community'], default: 'home_top' },
  isActive: { type: Boolean, default: false },
  adminApproved: { type: Boolean, default: false },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
export default Banner;
