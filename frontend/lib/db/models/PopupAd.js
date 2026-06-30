import mongoose from 'mongoose';

const popupAdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PopupAd = mongoose.models.PopupAd || mongoose.model('PopupAd', popupAdSchema);
export default PopupAd;
