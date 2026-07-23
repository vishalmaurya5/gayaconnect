import mongoose from 'mongoose';

const labourReviewSchema = new mongoose.Schema({
  labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labourer', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ['APPROVED', 'PENDING', 'REJECTED'], default: 'APPROVED' },
  createdAt: { type: Date, default: Date.now }
});

const LabourReview = mongoose.models.LabourReview || mongoose.model('LabourReview', labourReviewSchema);
export default LabourReview;
