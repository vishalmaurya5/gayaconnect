import mongoose from 'mongoose';

const labourPaymentSchema = new mongoose.Schema({
  labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labourer', required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Cash', 'Bank Transfer', 'Cheque'], default: 'UPI' },
  paymentDate: { type: Date, default: Date.now },
  period: { type: String, default: 'Daily Wage' },
  status: { type: String, enum: ['PAID', 'PENDING', 'FAILED'], default: 'PAID' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const LabourPayment = mongoose.models.LabourPayment || mongoose.model('LabourPayment', labourPaymentSchema);
export default LabourPayment;
