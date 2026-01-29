import nodemailer from "nodemailer";

// Send email using Gmail SMTP
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Hospitality App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("SEND EMAIL ERROR 👉", error);
    throw error;
  }
};
