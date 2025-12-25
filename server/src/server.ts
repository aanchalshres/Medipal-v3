import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import patientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import authRoutes from './routes/auth.routes';
import appointmentRoutes from './routes/appointment.routes';
import downloadRoutes from './routes/downloadRoutes';
import { notFound, errorHandler } from './utils/errorHandler';
import Doctor from './models/doctor.model';

// 1. Load env variables
dotenv.config();

// 2. Initialize uploads directory
const initUploadsDir = () => {
  const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Upload directory created at: ${uploadDir}`);
  }
  return uploadDir;
};
const UPLOAD_DIR = initUploadsDir();

// 3. Create Express app
const app = express();

// 4. Middleware setup
app.use(cors({
  origin: '*', // Your frontend URL
  credentials: true,               // If using cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Allowed methods
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Routes
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/download', downloadRoutes);

// 6. Error handling
app.use(notFound);
app.use(errorHandler);

// 7. Start server only after MongoDB connects
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log('✅ MongoDB connected');

    try {
      // Ensure schema-defined indexes are in sync (email, licenseNumber, etc.)
      await Doctor.syncIndexes();

      // Drop obsolete unique index on nmcNumber if it exists from older schema
      const collection = mongoose.connection.collection('doctors');
      const indexes = await collection.indexes();
      const hasOldIndex = indexes.some((idx) => idx.name === 'nmcNumber_1');
      if (hasOldIndex) {
        await collection.dropIndex('nmcNumber_1');
        console.log('🧹 Dropped obsolete index nmcNumber_1 on doctors collection');
      }
    } catch (idxErr) {
      console.warn('⚠️ Index sync/cleanup warning:', (idxErr as Error).message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`☁️  File storage: Cloudinary (${process.env.CLOUDINARY_CLOUD_NAME || 'not configured'})`);
      console.log(`📁 Fallback local directory: ${UPLOAD_DIR}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
