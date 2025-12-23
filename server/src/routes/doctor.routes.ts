// src/routes/doctor.routes.ts
import express from 'express';
import { registerDoctor, getDoctorProfile, updateDoctorProfile, searchDoctors, searchPatientByPatientId, listDoctorConsultations } from '../controllers/doctor.controller';
import { createConsultation } from '../controllers/consultation.controller';
// import upload from '../config/multer'; // Local storage
import { uploadCloud as upload } from '../config/cloudinary'; // Cloud storage
import { authenticate } from '../config/jwt';

const router = express.Router();

// Only allow doctors for specific routes
const ensureDoctor: express.RequestHandler = (req, res, next) => {
  if (req.user?.role !== 'doctor') {
    return res.status(403).json({ success: false, message: 'Forbidden: Doctor access required' });
  }
  next();
};

// Public routes
router.get('/search', searchDoctors); // Search doctors for booking appointments

// Public route - doctor registration
router.post('/register',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'degreeDocument', maxCount: 1 },
    { name: 'citizenshipDocument', maxCount: 1 }
  ]),
  registerDoctor
);

// Protected routes - require JWT authentication
router.get('/profile', authenticate, getDoctorProfile);

router.put('/profile', 
  authenticate, 
  upload.single('profilePhoto'),
  updateDoctorProfile
);

router.get('/dashboard', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Doctor dashboard data' 
  });
});

// Doctor-only: search patient by MediPal Patient ID (MP-<num><YYYYMMDD>)
router.get('/search-patient/:patientId', authenticate, ensureDoctor, searchPatientByPatientId);

// Doctor-only: create a consultation entry for a patient
router.post('/consultations', authenticate, ensureDoctor, createConsultation);
// Doctor-only: list their consultations (optionally filter by patientId)
router.get('/consultations', authenticate, ensureDoctor, listDoctorConsultations);

export default router;