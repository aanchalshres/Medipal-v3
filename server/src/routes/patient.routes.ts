import express from 'express';
import { registerPatient, getPatientProfile, updatePatientProfile } from '../controllers/patient.controller';
// import upload from '../config/multer'; // Local storage
import { uploadCloud as upload } from '../config/cloudinary'; // Cloud storage
import { authenticate } from '../config/jwt';

const router = express.Router();

// Multer error handling middleware
const handleMulterError = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Multer/Upload Error:', err);
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
      error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
  next();
};

// Public route - patient registration
router.post('/register', 
  (req, res, next) => {
    upload.fields([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'citizenshipDocument', maxCount: 1 },
      { name: 'insuranceCard', maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        console.error('❌ Upload middleware error:', err);
        return res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
      next();
    });
  },
  registerPatient
);

// Protected routes - require JWT authentication
router.get('/profile', authenticate, getPatientProfile);

router.put('/profile', authenticate, updatePatientProfile);

router.get('/dashboard', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user,
    message: 'Patient dashboard data' 
  });
});

export default router;