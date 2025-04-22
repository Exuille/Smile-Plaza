import express from 'express';
import {createAppointment, cancelAppointment,getMyAppointments, getAppointmentById, getAppointments, updateAppointment} from '../controllers/appointmentController.js';
import {protect} from '../controllers/authController.js';

const router = express.Router();

router.route("/create").post(protect, createAppointment);
router.route("/cancel/:id").put(protect, cancelAppointment); //edit for user
router.route("/myAppointments").get(protect, getMyAppointments);
router.route("/:id").get(protect, getAppointmentById);
router.route("/").get(protect, getAppointments);
router.route("/:id").put(protect, updateAppointment); //edit for admin

export default router;