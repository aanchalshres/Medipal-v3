import mongoose, { Document, Schema } from 'mongoose';

export interface IQRToken extends Document {
  token: string;
  patientId: mongoose.Types.ObjectId;
  usedByDoctorId?: mongoose.Types.ObjectId;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

const QRTokenSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  usedByDoctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date },
}, { timestamps: true });

QRTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IQRToken>('QRToken', QRTokenSchema);
