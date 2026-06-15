import mongoose from 'mongoose';

const labourerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  skill: { type: String, required: true },
  dailyRate: { type: Number },
  hourlyRate: { type: Number },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

labourerSchema.index({ location: '2dsphere' });

const Labourer = mongoose.models.Labourer || mongoose.model('Labourer', labourerSchema);
export default Labourer;
