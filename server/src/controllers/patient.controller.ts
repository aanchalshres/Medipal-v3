import { Request, Response } from 'express';
import Patient from '../models/patient.model';
import path from 'path';
import fs from 'fs';
import * as bcrypt from 'bcryptjs';

const handleFileUpload = (req: Request, fieldName: string) => {
  if (!req.files) return undefined;
  
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  return files[fieldName]?.[0]?.filename;
};

const cleanupFiles = (files: string[]) => {
  files.forEach(file => {
    if (file) {
      try {
        const filePath = path.join(process.env.UPLOAD_DIR as string, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Error deleting file ${file}:`, err);
      }
    }
  });
};

export const registerPatient = async (req: Request, res: Response) => {
  let citizenshipDocument: string | undefined;
  let profilePhoto: string | undefined;
  let insuranceCard: string | undefined;

  try {
    // Debug: Log incoming request
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    if (req.files) {
      console.log('Uploaded files:', Object.keys(req.files));
    }

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
    const requiredFields = ['password', 'email', 'fullName', 'dateOfBirth'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      cleanupFiles([citizenshipDocument, profilePhoto, insuranceCard].filter(Boolean) as string[]);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Prepare patient data
    const patientData = {
      ...req.body,
      password: hashedPassword,
      citizenshipDocument,
      profilePhoto,
      insuranceCard: insuranceCard || undefined,
      allergies: req.body.allergies ? req.body.allergies.split(',').map((a: string) => a.trim()) : [],
      currentMedications: req.body.currentMedications ? req.body.currentMedications.split(',').map((m: string) => m.trim()) : [],
      chronicConditions: req.body.chronicConditions ? req.body.chronicConditions.split(',').map((c: string) => c.trim()) : [],
      dateOfBirth: new Date(req.body.dateOfBirth)
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
    // if (error.name === 'ValidationError') {
    //   errorMessage = 'Validation failed: ' + Object.values(error.errors).map((e: any) => e.message).join(', ');
    // } else if (error.code === 11000) {
    //   errorMessage = 'Email already exists. Please use a different email.';
    // }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};