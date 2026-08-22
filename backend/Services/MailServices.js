import nodemailer from "nodemailer";
import config from "../config/config.js";

// Clean pass: strip spaces if Google App Password was entered with spaces (e.g. "abcd efgh ijkl mnop")
const cleanPass = config.email.pass ? config.email.pass.replace(/\s+/g, '') : '';

const transportOptions = process.env.EMAIL_HOST
  ? {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
      secure: false,
      auth: {
        user: config.email.user,
        pass: cleanPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  : {
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: cleanPass,
      },
    };

const transporter = nodemailer.createTransport(transportOptions);

export const sendEmail = async (to, subject, text) => {
  if (!config.email.user || !config.email.pass) {
    console.warn("⚠️ [Mail Service] EMAIL_USER or EMAIL_PASSWORD missing in config. Email sending skipped.");
    return;
  }

  const mailOptions = {
    from: `"HR Management" <${config.email.user}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message || error);
    throw error;
  }
};
