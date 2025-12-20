// src/routes/doctor.routes.ts
import express from 'express';
import { registerDoctor } from '../controllers/doctor.controller';
import upload from '../config/multer';

const router = express.Router();

// Doctor registration route with file uploads
router.post('/register', 
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'degreeDocument', maxCount: 1 },
    { name: 'citizenshipDocument', maxCount: 1 }
  ]),
  registerDoctor
);
// Get doctor documents route
export default router;