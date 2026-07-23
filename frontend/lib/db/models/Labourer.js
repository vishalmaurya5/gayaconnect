import mongoose from 'mongoose';

const labourerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  photo: { type: String },
  role: { type: String },
  profession: { type: String },
  category: { type: String },
  experience: { type: String },
  area: { type: String },
  location: { type: String },
  address: { type: String },
  pincode: { type: String },
  district: { type: String },
  state: { type: String },
  bloodGroup: { type: String },
  dailyRate: { type: Number },
  hourlyRate: { type: Number },
  skills: { type: [String], default: [] },
  availability: { type: Boolean, default: true },
  lwfId: { type: String, unique: true, sparse: true },
  aadhaarNumber: { type: String },
  aadhaarImage: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  isApproved: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Labourer = mongoose.models.Labourer || mongoose.model('Labourer', labourerSchema);
export default Labourer;
