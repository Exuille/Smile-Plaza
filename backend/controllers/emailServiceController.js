import nodemailer from 'nodemailer';

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
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL,
        subject: `Contact Form Submission: ${subject}`,
        html: `
          <div">
            <p>${message.replace(/\n/g, "<br/>")}</p>
            
            <br/><br/>
            <p>Sincerely,</p>
            <p>${name}</p>
            <p><a href="mailto:${email}">${email}</a></p>
            <p>${phone}</p>
      
          </div>
        `,
      };
      
  
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Message sent successfully." });
    } catch (err) {
      console.error("Email error:", err);
      return res.status(500).json({ message: "Failed to send message." });
    }
  };
