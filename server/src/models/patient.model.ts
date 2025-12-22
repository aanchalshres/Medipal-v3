import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  patientNumber: number;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  dateOfBirth: Date;
  bloodGroup: string;
  height: number;
  weight: number;
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  citizenshipNumber: string;
  citizenshipIssuedDistrict: string;
  citizenshipDocument: string;
  profilePhoto: string;
  insuranceCard?: string;
}

const PatientSchema: Schema = new Schema({
  patientNumber: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  allergies: { type: [String], default: [] },
  currentMedications: { type: [String], default: [] },
  chronicConditions: { type: [String], default: [] },
  emergencyContactName: { type: String, required: true },
  emergencyContactPhone: { type: String, required: true },
  emergencyContactRelation: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String },
  citizenshipNumber: { type: String, required: true },
  citizenshipIssuedDistrict: { type: String, required: true },
  citizenshipDocument: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  insuranceCard: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IPatient>('Patient', PatientSchema);