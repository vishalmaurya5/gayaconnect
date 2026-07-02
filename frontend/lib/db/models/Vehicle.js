import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  vehicleName: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleNumber: { type: String, required: true, unique: true },
  dlNumber: { type: String, required: true },
  isCommercial: { type: Boolean, default: true },
  liabilityAccepted: { type: Boolean, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  availability_status: { type: String, enum: ['available', 'booked'], default: 'available' },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
