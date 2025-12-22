import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  patientPhone: string;
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  appointmentType: string;
  date: Date;
  time: string;
  reason: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled';
  createdBy: 'patient' | 'doctor';
}

const AppointmentSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  doctorSpecialization: { type: String, required: true },
  hospitalName: { type: String, required: true },
  appointmentType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  createdBy: { 
    type: String, 
    enum: ['patient', 'doctor'], 
    required: true 
  }
}, {
  timestamps: true
});

// Index for faster queries
AppointmentSchema.index({ patientId: 1, date: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1 });
AppointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
