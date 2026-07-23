import mongoose from 'mongoose';

const labourAttendanceSchema = new mongoose.Schema({
  labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labourer', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'OVERTIME'], required: true },
  checkInTime: { type: String, default: '09:00 AM' },
  checkOutTime: { type: String, default: '06:00 PM' },
  notes: { type: String },
  recordedBy: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

labourAttendanceSchema.index({ labourId: 1, date: 1 }, { unique: true });

const LabourAttendance = mongoose.models.LabourAttendance || mongoose.model('LabourAttendance', labourAttendanceSchema);
export default LabourAttendance;
