import { sendMail } from "../utils/emailService.js";

export const sendOtpEmail = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ message: "Email and OTP code are required." });
    }

    const success = await sendMail(email, otpCode);

    if (success) {
      return res.status(200).json({ message: "OTP sent successfully." });
    } else {
      return res.status(500).json({ message: "Failed to send OTP email." });
    }
  } catch (error) {
    console.error("Error in sendOtpEmail:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
