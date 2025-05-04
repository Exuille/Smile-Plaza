import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

export async function sendMail(email, otpCode) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "HemoCart Login Verification",
      text: `We have received a request to sign in to your HemoCart account. 
To complete the authentication process, please use the One-Time Password (OTP) provided below:

🔐 One-Time Password (OTP): {{${otpCode}}}

This code is valid for five (5) minutes from the time it was generated. For your protection, please do not share this code with anyone under any circumstance.

If you did not attempt to log in, we strongly advise that you disregard this message and contact our support team immediately, so we can ensure the security of your account.

Thank you for choosing HemoCart — committed to innovation and security in blood specimen management.

Warm regards,
HemoCart Support Team`,
      html: `<p>We have received a request to sign in to your HemoCart account. 
To complete the authentication process, please use the One-Time Password (OTP) provided below:</p>
<p>🔐 One-Time Password (OTP): <strong>${otpCode}</strong></p>
<p>This code is valid for five (5) minutes from the time it was generated. For your protection, please do not share this code with anyone under any circumstance.</p>
<p>If you did not attempt to log in, we strongly advise that you disregard this message and contact our support team immediately, so we can ensure the security of your account.</p>
<p>Thank you for choosing HemoCart — committed to innovation and security in blood specimen management.</p>
<p>Warm regards,<br>HemoCart Support Team</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
