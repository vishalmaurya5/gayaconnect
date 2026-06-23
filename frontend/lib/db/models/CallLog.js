import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
  callerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  callerName: { type: String, required: true },
  callerPhone: { type: String, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId },
  receiverName: { type: String, required: true },
  receiverType: { type: String, enum: ['Vendor', 'Labourer', 'Vehicle'], required: true },
  receiverPhone: { type: String, required: true },
  actionType: { type: String, enum: ['Call', 'WhatsApp'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const CallLog = mongoose.models.CallLog || mongoose.model('CallLog', callLogSchema);
export default CallLog;
