import mongoose from 'mongoose';

const labourerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  photo: { type: String },
  role: { type: String, required: true },
  category: { type: String },
  area: { type: String, required: true },
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
  aadhaarNumber: { type: String, required: true },
  aadhaarImage: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  isApproved: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

delete mongoose.models.Labourer;
const Labourer = mongoose.model('Labourer', labourerSchema);
export default Labourer;
