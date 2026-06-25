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
  dailyRate: { type: Number },
  hourlyRate: { type: Number },
  skills: { type: [String], default: [] },
  availability: { type: Boolean, default: true },
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
