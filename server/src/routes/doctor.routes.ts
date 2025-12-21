// src/routes/doctor.routes.ts
import express from 'express';
import { registerDoctor, getDoctorProfile, updateDoctorProfile } from '../controllers/doctor.controller';
// import upload from '../config/multer'; // Local storage
import { uploadCloud as upload } from '../config/cloudinary'; // Cloud storage
import { authenticate } from '../config/jwt';

const router = express.Router();

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

router.put('/profile', authenticate, updateDoctorProfile);

router.get('/dashboard', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Doctor dashboard data' 
  });
});

export default router;