import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";

// Set password after OTP verification
export const setPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 400);
    }

    // Ensure OTP is verified before setting password
    if (!user.isOtpVerified) {
      throw new AppError("OTP not verified", 400);
    }

    // Hash the new password
    const hash = await bcrypt.hash(password, 10);

    // Update user password and verification status
    user.passwordHash = hash;
    user.isVerified = true;
    await user.save();

    // Send success response
    res.json({
      message: "Password set successfully. Signup complete.",
    });
  } catch (error) {
    // Forward error to global error handler
    next(error);
  }
};
