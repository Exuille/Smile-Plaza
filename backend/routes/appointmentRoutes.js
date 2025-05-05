import express from 'express';
import {
  createAppointment, 
  cancelAppointment,
  getMyAppointments, 
  getAppointmentById, 
  getAppointments,
  updateAppointment,
  getAppointmentMetrics,
  getAvailableTimes
} from '../controllers/appointmentController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.get('/availableTime', protect, getAvailableTimes);
router.get('/metrics', protect, getAppointmentMetrics);
router.get('/myAppointments', protect, getMyAppointments);
router.post('/create', protect, createAppointment);
router.put('/cancel/:id', protect, cancelAppointment);

// Admin routes
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);

export default router;
