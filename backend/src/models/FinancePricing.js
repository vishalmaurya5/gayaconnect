import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, unique: true },
  basePrice: { type: Number, required: true },
  gstPercentage: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.FinancePricing || mongoose.model('FinancePricing', pricingSchema);
