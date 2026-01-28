import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { sendEmail } from "../../utils/sendEmail.js";

// Send OTP for forgot password
export const forgotPasswordSendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP email
    await sendEmail({
      to: email,
      subject: "Reset Password OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};
