import nodemailer from "nodemailer";

// Send email using Brevo SMTP
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // apikey
        pass: process.env.EMAIL_PASS, // SMTP key
      },
    });

    await transporter.sendMail({
      from: `"Hospitality App" <junaidsk4901@gmail.com>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("SEND EMAIL ERROR 👉", error);
    throw error;
  }
};
