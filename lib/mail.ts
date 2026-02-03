import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@tohfaah.online",
    pass: process.env.MAIL_PASS!,
  },
});

export const MAIL_FROM = `"Tohfaah 💗" <support@tohfaah.online>`;
export const ADMIN_EMAIL = "support@tohfaah.online";
