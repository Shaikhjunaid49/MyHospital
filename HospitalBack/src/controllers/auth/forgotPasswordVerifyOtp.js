import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";

// Verify forgot password OTP
export const forgotPasswordVerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    if (user.otpExpires < Date.now()) {
      throw new AppError("OTP expired", 400);
    }

    res.json({ message: "OTP verified" });
  } catch (error) {
    next(error);
  }
};
