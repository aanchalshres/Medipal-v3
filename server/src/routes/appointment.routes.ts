import express from 'express';
import { authenticate } from '../config/jwt';
import {
  createAppointmentByPatient,
  createAppointmentByDoctor,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentById
} from '../controllers/appointment.controller';

const router = express.Router();

// Patient routes
router.post('/patient/create', authenticate, createAppointmentByPatient);
router.get('/patient/list', authenticate, getPatientAppointments);

// Doctor routes
router.post('/doctor/create', authenticate, createAppointmentByDoctor);
router.get('/doctor/list', authenticate, getDoctorAppointments);

// Common routes (both patient and doctor)
router.get('/:id', authenticate, getAppointmentById);
router.put('/:id/status', authenticate, updateAppointmentStatus);
router.delete('/:id', authenticate, deleteAppointment);

export default router;
