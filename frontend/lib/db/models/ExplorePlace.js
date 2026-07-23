import mongoose from 'mongoose';

const explorePlaceSchema = new mongoose.Schema({
  cityId: { type: String, required: true, lowercase: true, trim: true }, // e.g. "gaya", "newada"
  region: { type: String, enum: ['city', 'nearby'], default: 'city' },
  title: { type: String, required: true },
  category: { type: String, enum: ['temples', 'historical', 'hills', 'malls'], default: 'historical' },
  desc: { type: String, required: true },
  longDesc: { type: String },
  image: { type: String, required: true },
  location: { type: String, required: true },
  googleMapsUrl: { type: String },
  wikiUrl: { type: String },
  isFeaturedHomepage: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ExplorePlace = mongoose.models.ExplorePlace || mongoose.model('ExplorePlace', explorePlaceSchema);
export default ExplorePlace;
