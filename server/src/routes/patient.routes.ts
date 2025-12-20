import express from 'express';
import { registerPatient } from '../controllers/patient.controller';
// import upload from '../config/multer'; // Local storage
import { uploadCloud as upload } from '../config/cloudinary'; // Cloud storage
import { authenticate } from '../config/jwt';

const router = express.Router();

// Public route - patient registration
router.post('/register', 
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'citizenshipDocument', maxCount: 1 },
    { name: 'insuranceCard', maxCount: 1 }
  ]),
  registerPatient
);

// Protected routes - require JWT authentication
router.get('/profile', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Patient profile accessed successfully' 
  });
});

router.get('/dashboard', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Patient dashboard data' 
  });
});

export default router;