// utils/OTPmailer.js
import nodemailer from "nodemailer";

// transporter banao (SMTP/Gmail ke liye)
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,      
    pass: process.env.EMAIL_PASSWORD, 
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
    throw error;
  }
};