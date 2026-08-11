import nodemailer from "nodemailer";
import { emailConfig, isEmailConfigured } from "../config/email.js";

let transporter = null;

if (isEmailConfigured()) {
  transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.port === 465,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    return;
  }

  if (!transporter) {
    console.log("Email (dev fallback):", { to, subject });
    return;
  }

  await transporter.sendMail({
    from: emailConfig.from,
    to,
    subject,
    html,
  });
};
