import { Request, Response } from 'express';
import Consultation from '../models/consultation.model';
import Patient from '../models/patient.model';
import Doctor from '../models/doctor.model';

// Create a consultation entry by a doctor for a patient
export const createConsultation = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Forbidden: Doctor access required' });
    }

    const { patientId, date, diagnosis, notes, prescriptions, hospital, followUpRequired } = req.body;
    if (!patientId || !date) {
      return res.status(400).json({ success: false, message: 'patientId and date are required' });
    }

    // Support MP-<patientNo><YYYYMMDD>, MP-<ObjectId><YYYYMMDD>, or raw ObjectId
    const raw = String(patientId).replace(/\s+/g, '');
    let patientDoc = null as any;
    // Format: MP-<number><YYYYMMDD>
    const seqMatch = raw.match(/^MP-?(\d+)(\d{8})$/);
    if (seqMatch) {
      const patientNumber = parseInt(seqMatch[1], 10);
      const dobStr = seqMatch[2];
      const year = parseInt(dobStr.slice(0, 4), 10);
      const month = parseInt(dobStr.slice(4, 6), 10) - 1;
      const day = parseInt(dobStr.slice(6, 8), 10);
      const dobStart = new Date(Date.UTC(year, month, day, 0, 0, 0));
      const dobEnd = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
      patientDoc = await Patient.findOne({ patientNumber, dateOfBirth: { $gte: dobStart, $lte: dobEnd } }).select('_id');
    } else {
      // Format: MP-<ObjectId><YYYYMMDD>
      const oidMatch = raw.match(/^MP-?([0-9a-fA-F]{24})(\d{8})$/);
      if (oidMatch) {
        patientDoc = await Patient.findById(oidMatch[1]).select('_id');
      } else {
        // Raw ObjectId
        patientDoc = await Patient.findById(raw).select('_id');
      }
    }

    const patient = patientDoc;
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const doctor = await Doctor.findById(user.id).select('_id');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const consultation = new Consultation({
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date(date),
      diagnosis,
      notes,
      prescriptions: Array.isArray(prescriptions) ? prescriptions : [],
      hospital,
      followUpRequired: Boolean(followUpRequired),
    });

    await consultation.save();

    // Enrich response with resolved fields for client convenience
    const response = {
      _id: consultation._id,
      date: consultation.date,
      diagnosis: consultation.diagnosis,
      notes: consultation.notes,
      prescriptions: consultation.prescriptions,
      hospital: consultation.hospital,
      followUpRequired: consultation.followUpRequired,
      patientId: patient._id,
      patientName: (await Patient.findById(patient._id).select('fullName'))?.fullName || '',
    };

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return res.status(500).json({ success: false, message: 'Failed to create consultation' });
  }
};