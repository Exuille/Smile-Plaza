import express from "express";
import { /* sendOtpEmail ,*/ sendContactMessage } from "../controllers/emailServiceController.js";

const router = express.Router();

//router.post("/send-otp", sendOtpEmail);
router.post("/contact", sendContactMessage);

export default router;
