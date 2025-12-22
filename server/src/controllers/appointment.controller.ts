import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import Patient from '../models/patient.model';
import Doctor from '../models/doctor.model';

// Create appointment by patient
export const createAppointmentByPatient = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { doctorId, appointmentType, date, time, reason, notes } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentType || !date || !time || !reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Get patient details
    const patient = await Patient.findById(user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Get doctor details
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Format specialization (handle array)
    const specializationString = Array.isArray(doctor.specialization) 
      ? doctor.specialization.join(', ') 
      : doctor.specialization;

    // Create appointment
    const appointment = new Appointment({
      patientId: patient._id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      doctorSpecialization: specializationString,
      hospitalName: doctor.hospital,
      appointmentType,
      date: new Date(date),
      time,
      reason,
      notes,
      status: 'Pending',
      createdBy: 'patient'
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Create appointment by doctor
export const createAppointmentByDoctor = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { patientId, appointmentType, date, time, reason, notes } = req.body;

    // Validate required fields
    if (!patientId || !appointmentType || !date || !time || !reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Get doctor details
    const doctor = await Doctor.findById(user.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Get patient details
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Format specialization (handle array)
    const specializationString = Array.isArray(doctor.specialization) 
      ? doctor.specialization.join(', ') 
      : doctor.specialization;

    // Create appointment
    const appointment = new Appointment({
      patientId: patient._id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      doctorSpecialization: specializationString,
      hospitalName: doctor.hospital,
      appointmentType,
      date: new Date(date),
      time,
      reason,
      notes,
      status: 'Pending',
      createdBy: 'doctor'
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Get appointments for logged-in patient
export const getPatientAppointments = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await Appointment.find({ patientId: user.id })
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error: any) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Get appointments for logged-in doctor
export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await Appointment.find({ doctorId: user.id })
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error: any) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Update appointment status (by patient or doctor)
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check authorization (either patient or doctor can update)
    if (appointment.patientId.toString() !== user.id && appointment.doctorId.toString() !== user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this appointment' 
      });
    }

    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Delete appointment (cancel)
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check authorization
    if (appointment.patientId.toString() !== user.id && appointment.doctorId.toString() !== user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this appointment' 
      });
    }

    // Instead of deleting, mark as cancelled
    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// Get single appointment details
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check authorization
    if (appointment.patientId.toString() !== user.id && appointment.doctorId.toString() !== user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this appointment' 
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
};
