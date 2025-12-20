import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Patient from '../models/patient.model';
import Doctor from '../models/doctor.model';

export const login = async (req: Request, res: Response) => {
  const { phone, password, role } = req.body;

  try {
    let user;
    if (role === 'patient') {
      user = await Patient.findOne({ phone });
    } else if (role === 'doctor') {
      user = await Doctor.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role, phone: user.phone },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data without password - safe approach
    const userData = user.toObject();
    const { password: _, ...sanitizedUser } = userData;

    res.status(200).json({
      success: true,
      token,
      user: sanitizedUser,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};