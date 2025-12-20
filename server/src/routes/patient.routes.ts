import express from 'express';
import { registerPatient } from '../controllers/patient.controller';
import upload from '../config/multer';

const router = express.Router();

router.post('/register', 
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'citizenshipDocument', maxCount: 1 }
  ]),
  registerPatient
);

export default router;