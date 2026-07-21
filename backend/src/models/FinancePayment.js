import mongoose from 'mongoose';

const financePaymentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  businessName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  
  service: { type: String, required: true },
  description: { type: String },
  
  amount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Partial Paid', 'Cancelled', 'Refunded', 'Failed'], default: 'Pending' },
  referenceNumber: { type: String },
  paymentDate: { type: Date, default: Date.now },
  remarks: { type: String },
  
  screenshotUrl: { type: String },
  receiptUrl: { type: String },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.FinancePayment || mongoose.model('FinancePayment', financePaymentSchema);
