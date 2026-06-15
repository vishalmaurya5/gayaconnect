import mongoose from 'mongoose';

const communityNeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'fulfilled', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CommunityNeed = mongoose.models.CommunityNeed || mongoose.model('CommunityNeed', communityNeedSchema);
export default CommunityNeed;
