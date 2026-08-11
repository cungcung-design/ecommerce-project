import dotenv from "dotenv";

dotenv.config();

export const emailConfig = {
  host: process.env.EMAIL_HOST || "",
  port: Number(process.env.EMAIL_PORT) || 587,
  user: process.env.EMAIL_USER || "",
  password: process.env.EMAIL_PASSWORD || "",
  from: process.env.EMAIL_FROM || "no-reply@example.com",
};

export const isEmailConfigured = () => {
  return Boolean(emailConfig.host && emailConfig.user && emailConfig.password);
};
