import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";

// Verify signup OTP sent to user's email
export const verifySignupOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 400);
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    // Check if OTP has expired
    if (user.otpExpires < Date.now()) {
      throw new AppError("OTP expired", 400);
    }

    // Mark OTP as verified and clear OTP fields
    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Send success response
    res.json({
      message: "OTP verified. Please set your password.",
    });
  } catch (error) {
    // Forward error to global error handler
    next(error);
  }
};
