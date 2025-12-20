// src/controllers/doctor.controller.ts
import { Request, Response } from 'express';
import Doctor, { IDoctor } from '../models/doctor.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import upload from '../config/multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Utility function to handle file paths
const getFileUrl = (req: Request, filename: string) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Register a new doctor
export const registerDoctor = async (req: Request, res: Response) => {
  try {
    // Check if email already exists
    const existingDoctor = await Doctor.findOne({ email: req.body.email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Check if license number already exists
    const existingLicense = await Doctor.findOne({ licenseNumber: req.body.licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ success: false, message: 'License number already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new doctor
    const doctorData: Partial<IDoctor> = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      gender: req.body.gender,
      dateOfBirth: new Date(req.body.dateOfBirth),
      licenseNumber: req.body.licenseNumber,
      specialization: req.body.specialization,
      yearsOfExperience: parseInt(req.body.yearsOfExperience),
      hospital: req.body.hospital,
      qualifications: req.body.qualifications,
      availableDays: req.body.availableDays,
      consultationFee: parseFloat(req.body.consultationFee),
      paymentMethods: req.body.paymentMethods,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,
      citizenshipNumber: req.body.citizenshipNumber,
      citizenshipIssuedDistrict: req.body.citizenshipIssuedDistrict,
      isVerified: false,
      verificationStatus: 'Pending'
    };

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files['licenseDocument']) {
        doctorData.licenseDocument = getFileUrl(req, files['licenseDocument'][0].filename);
      }
      if (files['degreeDocument']) {
        doctorData.degreeDocument = getFileUrl(req, files['degreeDocument'][0].filename);
      }
      if (files['citizenshipDocument']) {
        doctorData.citizenshipDocument = getFileUrl(req, files['citizenshipDocument'][0].filename);
      }
      if (files['profilePhoto']) {
        doctorData.profilePhoto = getFileUrl(req, files['profilePhoto'][0].filename);
      }
    }

    const doctor = new Doctor(doctorData);
    await doctor.save();

    // Create JWT token
    const token = jwt.sign({ id: doctor._id, role: 'doctor' }, JWT_SECRET, {
      expiresIn: '7d'
    });

    // Omit password from response using destructuring
    const { password, ...doctorResponse } = doctor.toObject();

    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted for verification',
      data: doctorResponse,
      token
    });

  } catch (error) {
    console.error('Error registering doctor:', error);
    
    // Clean up uploaded files if error occurs
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      Object.values(files).forEach(fileArray => {
        fileArray.forEach(file => {
          const filePath = path.join('uploads', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error registering doctor',
      error: (error as Error).message 
    });
  }
};

// Get all doctors (for admin or public listing)
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { specialization, city, country, verified } = req.query;
    
    const filter: any = {};
    if (specialization) filter.specialization = { $in: [specialization as string] };
    if (city) filter.city = city;
    if (country) filter.country = country;
    if (verified) filter.isVerified = verified === 'true';
    
    const doctors = await Doctor.find(filter)
      .select('-password -licenseDocument -degreeDocument -citizenshipDocument')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching doctors',
      error: (error as Error).message 
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-password -licenseDocument -degreeDocument -citizenshipDocument');
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching doctor',
      error: (error as Error).message 
    });
  }
};

// Update doctor verification status (admin only)
export const updateDoctorVerification = async (req: Request, res: Response) => {
  try {
    const { verificationStatus } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { 
        verificationStatus,
        isVerified: verificationStatus === 'Approved'
      },
      { new: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor verification status updated',
      data: doctor
    });
  } catch (error) {
    console.error('Error updating doctor verification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating doctor verification',
      error: (error as Error).message 
    });
  }
};

// Get specializations for dropdown
export const getSpecializations = async (req: Request, res: Response) => {
  try {
    const specializations = await Doctor.distinct('specialization');
    res.status(200).json({
      success: true,
      data: specializations
    });
  } catch (error) {
    console.error('Error fetching specializations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching specializations',
      error: (error as Error).message 
    });
  }
};

// Get available days for dropdown
export const getAvailableDays = async (req: Request, res: Response) => {
  try {
    const availableDays = await Doctor.distinct('availableDays');
    res.status(200).json({
      success: true,
      data: availableDays
    });
  } catch (error) {
    console.error('Error fetching available days:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching available days',
      error: (error as Error).message 
    });
  }
};

// Get payment methods for dropdown
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await Doctor.distinct('paymentMethods');
    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payment methods',
      error: (error as Error).message 
    });
  }
};