import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['job', 'sale'], required: true },
  salaryOrPrice: { type: String },
  location: { type: String },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  postedByAdmin: { type: Boolean, default: false },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
