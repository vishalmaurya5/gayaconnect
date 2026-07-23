import mongoose from 'mongoose';

const exploreCitySchema = new mongoose.Schema({
  cityId: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  state: { type: String, default: 'Bihar' },
  desc: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ExploreCity = mongoose.models.ExploreCity || mongoose.model('ExploreCity', exploreCitySchema);
export default ExploreCity;
