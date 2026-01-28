import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { AppError } from "../../utils/AppError.js";

// Reset password
export const forgotPasswordReset = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.passwordHash = hashedPassword;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
