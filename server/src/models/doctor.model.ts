// src/models/doctor.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  dateOfBirth: Date;
  licenseNumber: string;
  specialization: string[];
  yearsOfExperience: number;
  hospital: string;
  qualifications: string;
  availableDays: string[];
  consultationFee: number;
  paymentMethods: string[];
  address: string;
  city: string;
  country: string;
  postalCode: string;
  citizenshipNumber: string;
  citizenshipIssuedDistrict: string;
  licenseDocument: string;
  degreeDocument: string;
  citizenshipDocument: string;
  profilePhoto: string;
  isVerified: boolean;
  verificationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  dateOfBirth: { type: Date, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  specialization: { type: [String], required: true },
  yearsOfExperience: { type: Number, required: true },
  hospital: { type: String, required: true },
  qualifications: { type: String, required: true },
  availableDays: { type: [String], required: true },
  consultationFee: { type: Number, required: true },
  paymentMethods: { type: [String], required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String },
  citizenshipNumber: { type: String, required: true },
  citizenshipIssuedDistrict: { type: String, required: true },
  licenseDocument: { type: String, required: true },
  degreeDocument: { type: String, required: true },
  citizenshipDocument: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
}, {
  timestamps: true
});

// Add indexes for frequently queried fields
doctorSchema.index({ email: 1 });
doctorSchema.index({ licenseNumber: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ city: 1 });
doctorSchema.index({ country: 1 });

const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);

export default Doctor;