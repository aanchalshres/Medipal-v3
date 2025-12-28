import { Request, Response } from 'express';
import Patient from '../models/patient.model';
import path from 'path';
import fs from 'fs';
import * as bcrypt from 'bcryptjs';
import Consultation from '../models/consultation.model';
import Doctor from '../models/doctor.model';

const handleFileUpload = (req: Request, fieldName: string) => {
  if (!req.files) return undefined;
  
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  return files[fieldName]?.[0]?.path || files[fieldName]?.[0]?.filename;
};

const cleanupFiles = (files: string[]) => {
  console.log('Files uploaded to Cloudinary:', files);
};

export const registerPatient = async (req: Request, res: Response) => {
  let citizenshipDocument: string | undefined;
  let profilePhoto: string | undefined;
  let insuranceCard: string | undefined;

  try {
    // Debug: Log incoming request
    const logMessage = `\n=== PATIENT REGISTRATION REQUEST ===\nRequest body fields: ${Object.keys(req.body).join(', ')}\nRequest files: ${req.files ? Object.keys(req.files).join(', ') : 'No files'}\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(__dirname, '../../debug.log'), logMessage + '\n');
    console.log('Request body fields:', Object.keys(req.body));
    console.log('Request files:', req.files ? Object.keys(req.files) : 'No files');
    console.log('Body data:', JSON.stringify(req.body, null, 2));

    // Handle file uploads
    citizenshipDocument = handleFileUpload(req, 'citizenshipDocument');
    profilePhoto = handleFileUpload(req, 'profilePhoto');
    insuranceCard = handleFileUpload(req, 'insuranceCard');

    // Debug: Log file upload results
    console.log('File upload results:', {
      citizenshipDocument,
      profilePhoto,
      insuranceCard
    });

    // Validate required files
    if (!citizenshipDocument || !profilePhoto) {
      cleanupFiles([citizenshipDocument, profilePhoto, insuranceCard].filter(Boolean) as string[]);
      return res.status(400).json({ 
        success: false, 
        message: 'Citizenship document and profile photo are required',
        details: {
          receivedFiles: {
            citizenshipDocument: !!citizenshipDocument,
            profilePhoto: !!profilePhoto,
            insuranceCard: !!insuranceCard
          }
        }
      });
    }

    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'password', 'phone', 'gender', 'dateOfBirth', 
      'bloodGroup', 'height', 'weight', 'emergencyContactName', 
      'emergencyContactPhone', 'emergencyContactRelation', 'address', 
      'city', 'country', 'citizenshipNumber', 'citizenshipIssuedDistrict'
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      cleanupFiles([citizenshipDocument, profilePhoto, insuranceCard].filter(Boolean) as string[]);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Get the next sequential patient number
    const patientCount = await Patient.countDocuments();
    const patientNumber = patientCount + 1;

    // Helper function to parse array fields
    const parseArrayField = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // If not JSON, split by comma
          return field.split(',').map((item: string) => item.trim()).filter(Boolean);
        }
      }
      return [];
    };

    // Prepare patient data with proper type conversion
    const patientData = {
      patientNumber,
      fullName: req.body.fullName?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      password: hashedPassword,
      phone: req.body.phone?.trim(),
      gender: req.body.gender,
      dateOfBirth: new Date(req.body.dateOfBirth),
      bloodGroup: req.body.bloodGroup,
      height: parseFloat(req.body.height),
      weight: parseFloat(req.body.weight),
      allergies: parseArrayField(req.body.allergies),
      currentMedications: parseArrayField(req.body.currentMedications),
      chronicConditions: parseArrayField(req.body.chronicConditions),
      emergencyContactName: req.body.emergencyContactName?.trim(),
      emergencyContactPhone: req.body.emergencyContactPhone?.trim(),
      emergencyContactRelation: req.body.emergencyContactRelation,
      address: req.body.address?.trim(),
      city: req.body.city?.trim(),
      country: req.body.country?.trim(),
      postalCode: req.body.postalCode?.trim() || '',
      citizenshipNumber: req.body.citizenshipNumber?.trim(),
      citizenshipIssuedDistrict: req.body.citizenshipIssuedDistrict?.trim(),
      citizenshipDocument,
      profilePhoto,
      insuranceCard: insuranceCard || undefined
    };

    // Debug: Log patient data before saving
    console.log('Patient data to save:', JSON.stringify(patientData, null, 2));

    // Create and save patient
    const patient = new Patient(patientData);
    await patient.save();
    

    // Debug: Log successful registration
    console.log('Patient registered successfully:', patient._id);

    res.status(201).json({
      success: true,
      data: {
        id: patient._id,
        fullName: patient.fullName,
        email: patient.email
      }
    });
  } catch (error: any) {
    // Clean up uploaded files if error occurs
    cleanupFiles([citizenshipDocument, profilePhoto, insuranceCard].filter(Boolean) as string[]);
    
    // Enhanced error logging
    console.error('Patient registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...(error.code && { code: error.code }),
      ...(error.keyValue && { duplicateKey: error.keyValue })
    });

    // Determine appropriate status code
    const statusCode = error.name === 'ValidationError' ? 400 : 
                      error.code === 11000 ? 409 : 500;

    // More specific error messages
    let errorMessage = 'Failed to register patient. Please try again.';
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation failed: ' + Object.values(error.errors).map((e: any) => e.message).join(', ');
    } else if (error.code === 11000) {
      errorMessage = 'Email already exists. Please use a different email.';
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { error: error.message, details: error })
    });
  }
};

export const getPatientProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const patient = await Patient.findById(user.id).select('-password');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (!patient.patientNumber) {
      const patientCount = await Patient.countDocuments();
      patient.patientNumber = patientCount;
      await patient.save();
    }

    const data = {
      id: patient._id,
      // Generate Patient ID in format: MP-<sequential_number><DOB_YYYYMMDD>
      patientId: (() => {
        const dobDate = new Date(patient.dateOfBirth);
        const dobFormatted = `${dobDate.getFullYear()}${String(dobDate.getMonth() + 1).padStart(2, '0')}${String(dobDate.getDate()).padStart(2, '0')}`;
        return `MP-${String(patient.patientNumber).padStart(2, '0')}${dobFormatted}`;
      })(),
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      bloodGroup: patient.bloodGroup,
      height: patient.height,
      weight: patient.weight,
      allergies: patient.allergies || [],
      medications: patient.currentMedications || [],
      chronicConditions: patient.chronicConditions || [],
      emergencyContact: {
        name: patient.emergencyContactName,
        phone: patient.emergencyContactPhone,
        relation: patient.emergencyContactRelation,
      },
      address: patient.address,
      city: patient.city,
      country: patient.country,
      postalCode: patient.postalCode,
      citizenshipNumber: patient.citizenshipNumber,
      citizenshipIssuedDistrict: patient.citizenshipIssuedDistrict,
      profilePhoto: patient.profilePhoto,
      citizenshipDocument: patient.citizenshipDocument,
      insuranceCard: patient.insuranceCard,
      createdAt: (patient as any).createdAt,
      updatedAt: (patient as any).updatedAt,
      role: 'patient',
    };

    return res.json({ success: true, user: data });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// Update logged-in patient profile (basic fields, no files)
export const updatePatientProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const parseArrayField = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : field.split(',').map((x: string) => x.trim()).filter(Boolean);
        } catch {
          return field.split(',').map((x: string) => x.trim()).filter(Boolean);
        }
      }
      return [];
    };

    const allowed: any = {};
    const body = req.body || {};
    
    // Handle profile photo upload
    if (req.file) {
      allowed.profilePhoto = req.file.path; // Cloudinary URL
    }
    
    if (body.fullName !== undefined) allowed.fullName = String(body.fullName).trim();
    if (body.phone !== undefined) allowed.phone = String(body.phone).trim();
    if (body.email !== undefined) allowed.email = String(body.email).trim().toLowerCase();
    if (body.gender !== undefined) allowed.gender = body.gender;
    if (body.dateOfBirth !== undefined) allowed.dateOfBirth = new Date(body.dateOfBirth);
    if (body.bloodGroup !== undefined) allowed.bloodGroup = body.bloodGroup;
    if (body.height !== undefined) allowed.height = parseFloat(body.height);
    if (body.weight !== undefined) allowed.weight = parseFloat(body.weight);
    if (body.allergies !== undefined) allowed.allergies = parseArrayField(body.allergies);
    if (body.medications !== undefined) allowed.currentMedications = parseArrayField(body.medications);
    if (body.chronicConditions !== undefined) allowed.chronicConditions = parseArrayField(body.chronicConditions);
    if (body.address !== undefined) allowed.address = String(body.address).trim();
    if (body.city !== undefined) allowed.city = String(body.city).trim();
    if (body.country !== undefined) allowed.country = String(body.country).trim();
    if (body.postalCode !== undefined) allowed.postalCode = String(body.postalCode).trim();
    if (body.emergencyContact !== undefined) {
      const ec = body.emergencyContact;
      if (ec.name !== undefined) allowed.emergencyContactName = String(ec.name).trim();
      if (ec.phone !== undefined) allowed.emergencyContactPhone = String(ec.phone).trim();
      if (ec.relation !== undefined) allowed.emergencyContactRelation = String(ec.relation).trim();
    }

    const updated = await Patient.findByIdAndUpdate(user.id, { $set: allowed }, { new: true }).select('-password');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const data = {
      id: updated._id,
      fullName: updated.fullName,
      email: updated.email,
      phone: updated.phone,
      gender: updated.gender,
      dateOfBirth: updated.dateOfBirth,
      bloodGroup: updated.bloodGroup,
      height: updated.height,
      weight: updated.weight,
      allergies: updated.allergies || [],
      medications: updated.currentMedications || [],
      chronicConditions: updated.chronicConditions || [],
      emergencyContact: {
        name: updated.emergencyContactName,
        phone: updated.emergencyContactPhone,
        relation: updated.emergencyContactRelation,
      },
      address: updated.address,
      city: updated.city,
      country: updated.country,
      postalCode: updated.postalCode,
      citizenshipNumber: updated.citizenshipNumber,
      citizenshipIssuedDistrict: updated.citizenshipIssuedDistrict,
      profilePhoto: updated.profilePhoto,
      citizenshipDocument: updated.citizenshipDocument,
      insuranceCard: updated.insuranceCard,
      createdAt: (updated as any).createdAt,
      updatedAt: (updated as any).updatedAt,
      role: 'patient',
    };

    return res.json({ success: true, user: data });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// Get consultations for the logged-in patient
export const getPatientConsultations = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id || user.role !== 'patient') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const consults = await Consultation.find({ patientId: user.id })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const doctorIds = Array.from(new Set(consults.map(c => String(c.doctorId))));
    const docs = await Doctor.find({ _id: { $in: doctorIds } }).select('fullName specialization');
    const dmap = new Map(docs.map(d => [String(d._id), { name: d.fullName, specialization: Array.isArray((d as any).specialization) ? (d as any).specialization[0] : '' }]));

    const data = consults.map(c => ({
      id: String(c._id),
      date: c.date,
      hospitalName: c.hospital || '',
      doctorName: dmap.get(String(c.doctorId))?.name || 'Doctor',
      doctorSpecialization: dmap.get(String(c.doctorId))?.specialization || '',
      chiefComplaint: '',
      diagnosis: c.diagnosis || '',
      prescription: c.prescriptions || [],
      notes: c.notes || '',
      status: c.followUpRequired ? 'Follow-up Required' : 'Completed',
    }));

    return res.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('Error fetching patient consultations:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch consultations' });
  }
};