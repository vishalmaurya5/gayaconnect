import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  labourerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labourer' },
  serviceDetails: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  scheduledDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
