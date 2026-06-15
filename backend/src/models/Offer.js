import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  title: { type: String, required: true },
  description: { type: String },
  discountText: { type: String },
  isActive: { type: Boolean, default: true },
  validUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
export default Offer;
