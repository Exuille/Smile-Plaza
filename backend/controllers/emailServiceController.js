import nodemailer from 'nodemailer';

export const sendContactMessage = async (req, res) => {
    const { name, email, contact, subject, content } = req.body;
  
    if (!name || !email || !contact || !subject || !content) {
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
            <p>${contact.replace(/\n/g, "<br/>")}</p>
            
            <br/><br/>
            <p>Sincerely,</p>
            <p>${name}</p>
            <p><a href="mailto:${email}">${email}</a></p>
            <p>${contact}</p>
      
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
