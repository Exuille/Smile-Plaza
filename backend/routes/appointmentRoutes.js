import express from 'express';
import {
    createAppointment, 
    cancelAppointment,
    getMyAppointments, 
    getAppointmentById, 
    getAppointments,
    updateAppointment,
    getAppointmentMetrics} from '../controllers/appointmentController.js';
import {protect} from '../controllers/authController.js';

const router = express.Router();

router.route("/create").post(protect, createAppointment);
router.route("/cancel/:id").put(protect, cancelAppointment); //edit for user
router.route("/myAppointments").get(protect, getMyAppointments); // for user 
router.route("/:id").get(protect, getAppointmentById); // fetch one 
router.route("/").get(protect, getAppointments); // for admin 
router.route("/:id").put(protect, updateAppointment); //edit for admin
router.get('/metrics', protect, getAppointmentMetrics)


export default router;