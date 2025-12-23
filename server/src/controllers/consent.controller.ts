import { Request, Response } from 'express';
import crypto from 'crypto';
import Consent from '../models/consent.model';
import QRToken from '../models/qrToken.model';

// Helper: check active consent
export const hasActiveConsent = async (patientId: string, doctorId: string, scope: string) => {
  const now = new Date();
  const consent = await Consent.findOne({ patientId, doctorId, scope, status: 'approved' });
  if (!consent) return false;
  if (consent.expiresAt && consent.expiresAt < now) return false;
  return true;
};

// Patient grants consent to a doctor for a scope
export const grantConsent = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id || user.role !== 'patient') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { doctorId, scope = 'medical-history', durationMinutes = 30 } = req.body;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'doctorId is required' });
    }

    const expiresAt = new Date(Date.now() + Number(durationMinutes) * 60 * 1000);
    const consent = await Consent.findOneAndUpdate(
      { patientId: user.id, doctorId, scope },
      { status: 'approved', expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, data: { consentId: consent._id, expiresAt: consent.expiresAt } });
  } catch (error) {
    console.error('grantConsent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to grant consent' });
  }
};

// Patient revokes consent
export const revokeConsent = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id || user.role !== 'patient') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { doctorId, scope = 'medical-history' } = req.body;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'doctorId is required' });
    }

    const updated = await Consent.findOneAndUpdate(
      { patientId: user.id, doctorId, scope },
      { status: 'revoked' },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Consent not found' });
    }
    return res.json({ success: true, message: 'Consent revoked' });
  } catch (error) {
    console.error('revokeConsent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to revoke consent' });
  }
};

// Patient generates a short-lived QR token
export const generateQrToken = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id || user.role !== 'patient') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await QRToken.create({ token, patientId: user.id, expiresAt });
    return res.json({ success: true, data: { token, expiresAt } });
  } catch (error) {
    console.error('generateQrToken error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate QR token' });
  }
};

// Doctor exchanges QR token for time-limited consent
export const exchangeQrToken = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id || user.role !== 'doctor') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { token, scope = 'medical-history', durationMinutes = 15 } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'token is required' });
    }

    const qr = await QRToken.findOne({ token });
    if (!qr) {
      return res.status(404).json({ success: false, message: 'Invalid token' });
    }
    if (qr.usedAt) {
      return res.status(400).json({ success: false, message: 'Token already used' });
    }
    if (qr.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Token expired' });
    }

    // Mark used and create consent
    qr.usedAt = new Date();
    qr.usedByDoctorId = user.id as any;
    await qr.save();

    const expiresAt = new Date(Date.now() + Number(durationMinutes) * 60 * 1000);
    const consent = await Consent.findOneAndUpdate(
      { patientId: qr.patientId, doctorId: user.id, scope },
      { status: 'approved', expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, message: 'Access granted', data: { expiresAt, patientId: qr.patientId } });
  } catch (error) {
    console.error('exchangeQrToken error:', error);
    return res.status(500).json({ success: false, message: 'Failed to exchange QR token' });
  }
};
