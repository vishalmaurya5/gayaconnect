import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  aadharNumber: { type: String, required: true, trim: true }, // Added Aadhar Number
  department: { type: String, default: 'General' },
  designation: { type: String, default: 'Staff' },
  joiningDate: { type: Date, default: Date.now },
  salary: { type: Number, default: 25000 },
  bloodGroup: { type: String, default: 'O+' },
  address: { type: String, default: 'Gaya, Bihar, India' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'], default: 'ACTIVE' },
  photo: { type: String, default: '' },
  password: { type: String }, // Store generated plaintext password for admin display
  performanceRating: { type: Number, default: 4.8 },
  totalLeavesTaken: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

delete mongoose.models.Employee;
const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
