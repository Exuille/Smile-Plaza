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

export const sendContactMessage = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
  
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS, 
        },
      });
  
      const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: `Contact Us - ${subject}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Message sent successfully." });
    } catch (err) {
      console.error("Email error:", err);
      return res.status(500).json({ message: "Failed to send message." });
    }
  };
