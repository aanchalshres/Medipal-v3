import mongoose, { Document, Schema } from 'mongoose';

export interface IConsent extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  scope: string; // e.g., 'medical-history'
  status: 'approved' | 'revoked';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConsentSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  scope: { type: String, required: true },
  status: { type: String, enum: ['approved', 'revoked'], default: 'approved' },
  expiresAt: { type: Date },
}, { timestamps: true });

ConsentSchema.index({ patientId: 1, doctorId: 1, scope: 1 }, { unique: true });

export default mongoose.model<IConsent>('Consent', ConsentSchema);
