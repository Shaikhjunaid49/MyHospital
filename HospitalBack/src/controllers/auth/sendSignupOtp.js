import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { sendEmail } from "../../utils/sendEmail.js";

// Send OTP for signup email verification
export const sendSignupOtp = async (req, res, next) => {
  try {
    const { name, email, role, specialization, experience } = req.body;

    // Validate required fields
    if (!name || !email) {
      throw new AppError("Name and Email are required", 400);
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    // Block signup if user already completed registration
    if (user && user.passwordHash !== "temp") {
      throw new AppError("User already exists", 400);
    }

    // Create temporary user if not found
    if (!user) {
      user = await User.create({
        name,
        email,
        role: role || "user",
        specialization: role === "doctor" ? specialization : undefined,
        experience: role === "doctor" ? experience : 0,
        passwordHash: "temp",
        isOtpVerified: false,
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry time
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP email
    await sendEmail({
      to: email,
      subject: "Your Signup OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    // Send success response
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    // Forward error to global error handler
    next(error);
  }
};
