import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
