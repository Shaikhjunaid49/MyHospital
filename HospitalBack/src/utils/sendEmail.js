import nodemailer from "nodemailer";

// Send email using Gmail SMTP
export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
      // Required for cloud platforms like Render
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter connection
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: `"Hospitality App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    // Log exact email error
    console.error("SEND EMAIL ERROR 👉", error);
    throw error;
  }
};
