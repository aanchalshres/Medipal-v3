import mongoose, { Document, Schema } from 'mongoose';

export interface IConsultation extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: Date;
  diagnosis?: string;
  notes?: string;
  prescriptions?: string[];
  hospital?: string;
  followUpRequired?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  date: { type: Date, required: true },
  diagnosis: { type: String },
  notes: { type: String },
  prescriptions: { type: [String], default: [] },
  hospital: { type: String },
  followUpRequired: { type: Boolean, default: false },
}, { timestamps: true });

ConsultationSchema.index({ patientId: 1, date: -1 });

export default mongoose.model<IConsultation>('Consultation', ConsultationSchema);