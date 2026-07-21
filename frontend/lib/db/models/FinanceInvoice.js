import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FinancePayment' },
  invoiceDate: { type: Date, default: Date.now },
  
  customerDetails: {
    name: String,
    phone: String,
    email: String,
    businessName: String,
    address: String
  },
  
  serviceDetails: {
    service: String,
    description: String,
    amount: Number,
    discount: Number,
    gst: Number,
    total: Number
  },
  
  paymentMethod: String,
  referenceNumber: String,
  
  status: { type: String, default: 'Generated' },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.FinanceInvoice || mongoose.model('FinanceInvoice', invoiceSchema);
