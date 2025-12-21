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

// Utility function to handle file paths (Cloudinary returns full URL in 'path')
const getFileUrl = (file: Express.Multer.File) => {
  return file.path; // Cloudinary stores the full URL in the path property
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

    // Create new doctor
    const doctorData: Partial<IDoctor> = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      gender: req.body.gender,
      dateOfBirth: new Date(req.body.dateOfBirth),
      licenseNumber: req.body.licenseNumber,
      specialization: parseArrayField(req.body.specialization),
      yearsOfExperience: parseInt(req.body.yearsOfExperience),
      hospital: req.body.hospital,
      qualifications: req.body.qualifications,
      availableDays: parseArrayField(req.body.availableDays),
      consultationFee: parseFloat(req.body.consultationFee),
      paymentMethods: parseArrayField(req.body.paymentMethods),
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,
      citizenshipNumber: req.body.citizenshipNumber,
      citizenshipIssuedDistrict: req.body.citizenshipIssuedDistrict,
      isVerified: false,
      verificationStatus: 'Pending'
    };

    // Handle file uploads (Cloudinary)
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files['licenseDocument']) {
        doctorData.licenseDocument = getFileUrl(files['licenseDocument'][0]);
      }
      if (files['degreeDocument']) {
        doctorData.degreeDocument = getFileUrl(files['degreeDocument'][0]);
      }
      if (files['citizenshipDocument']) {
        doctorData.citizenshipDocument = getFileUrl(files['citizenshipDocument'][0]);
      }
      if (files['profilePhoto']) {
        doctorData.profilePhoto = getFileUrl(files['profilePhoto'][0]);
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
    
    // Note: Cloudinary handles file storage automatically
    // Files uploaded to Cloudinary remain there even if registration fails
    // To delete from Cloudinary on error, implement cloudinary.uploader.destroy()

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

// Get logged-in doctor profile
export const getDoctorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const doctor = await Doctor.findById(user.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const data = {
      id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      dateOfBirth: doctor.dateOfBirth,
      licenseNumber: doctor.licenseNumber,
      specialization: doctor.specialization || [],
      yearsOfExperience: doctor.yearsOfExperience,
      hospital: doctor.hospital,
      qualifications: doctor.qualifications,
      availableDays: doctor.availableDays || [],
      consultationFee: doctor.consultationFee,
      paymentMethods: doctor.paymentMethods || [],
      address: doctor.address,
      city: doctor.city,
      country: doctor.country,
      postalCode: doctor.postalCode,
      profilePhoto: doctor.profilePhoto,
      isVerified: doctor.isVerified,
      verificationStatus: doctor.verificationStatus,
      createdAt: (doctor as any).createdAt,
      updatedAt: (doctor as any).updatedAt,
      role: 'doctor',
    };

    return res.json({ success: true, user: data });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// Update logged-in doctor profile (basic fields, no files)
export const updateDoctorProfile = async (req: Request, res: Response) => {
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
    if (body.fullName !== undefined) allowed.fullName = String(body.fullName).trim();
    if (body.phone !== undefined) allowed.phone = String(body.phone).trim();
    if (body.email !== undefined) allowed.email = String(body.email).trim().toLowerCase();
    if (body.gender !== undefined) allowed.gender = body.gender;
    if (body.dateOfBirth !== undefined) allowed.dateOfBirth = new Date(body.dateOfBirth);
    if (body.specialization !== undefined) allowed.specialization = parseArrayField(body.specialization);
    if (body.yearsOfExperience !== undefined) allowed.yearsOfExperience = parseInt(body.yearsOfExperience, 10);
    if (body.qualifications !== undefined) allowed.qualifications = String(body.qualifications).trim();
    if (body.hospital !== undefined) allowed.hospital = String(body.hospital).trim();
    if (body.address !== undefined) allowed.address = String(body.address).trim();
    if (body.city !== undefined) allowed.city = String(body.city).trim();
    if (body.country !== undefined) allowed.country = String(body.country).trim();
    if (body.postalCode !== undefined) allowed.postalCode = String(body.postalCode).trim();
    if (body.availableDays !== undefined) allowed.availableDays = parseArrayField(body.availableDays);
    if (body.consultationFee !== undefined) allowed.consultationFee = parseFloat(body.consultationFee);
    if (body.paymentMethods !== undefined) allowed.paymentMethods = parseArrayField(body.paymentMethods);

    const updated = await Doctor.findByIdAndUpdate(user.id, { $set: allowed }, { new: true }).select('-password');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const data = {
      id: updated._id,
      fullName: updated.fullName,
      email: updated.email,
      phone: updated.phone,
      gender: updated.gender,
      dateOfBirth: updated.dateOfBirth,
      specialization: updated.specialization,
      yearsOfExperience: updated.yearsOfExperience,
      qualifications: updated.qualifications,
      address: updated.address,
      city: updated.city,
      country: updated.country,
      postalCode: updated.postalCode,
      availableDays: updated.availableDays || [],
      paymentMethods: updated.paymentMethods || [],
      consultationFee: updated.consultationFee,
      profilePhoto: updated.profilePhoto,
      licenseDocument: updated.licenseDocument,
      createdAt: (updated as any).createdAt,
      updatedAt: (updated as any).updatedAt,
      role: 'doctor',
    };

    return res.json({ success: true, user: data });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};