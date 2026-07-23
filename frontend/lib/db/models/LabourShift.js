import mongoose from 'mongoose';

const labourShiftSchema = new mongoose.Schema({
  labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labourer', required: true },
  siteName: { type: String, required: true },
  clientName: { type: String },
  location: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  shiftType: { type: String, enum: ['Day', 'Night', 'Half Shift', 'Full Shift'], default: 'Full Shift' },
  dailyRate: { type: Number, required: true },
  status: { type: String, enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const LabourShift = mongoose.models.LabourShift || mongoose.model('LabourShift', labourShiftSchema);
export default LabourShift;
