import { Schema, model, Document } from 'mongoose';

export interface IPhoneNumber extends Document {
  phoneNumber: string;
  countryCode: string;
  fullNumber: string;
  messageSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PhoneNumberSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    default: '+977'
  },
  fullNumber: {
    type: String,
    required: true,
    unique: true
  },
  messageSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
PhoneNumberSchema.index({ fullNumber: 1 });
PhoneNumberSchema.index({ createdAt: 1 });

export default model<IPhoneNumber>('PhoneNumber', PhoneNumberSchema);