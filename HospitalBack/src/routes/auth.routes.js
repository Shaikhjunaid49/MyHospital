import express from "express";

import { sendSignupOtp } from "../controllers/auth/sendSignupOtp.js";
import { verifySignupOtp } from "../controllers/auth/verifySignupOtp.js";
import { setPassword } from "../controllers/auth/setPassword.js";
import { login } from "../controllers/auth/login.js";

import { forgotPasswordSendOtp } from "../controllers/auth/forgotPasswordSendOtp.js";
import { forgotPasswordVerifyOtp } from "../controllers/auth/forgotPasswordVerifyOtp.js";
import { forgotPasswordReset } from "../controllers/auth/forgotPasswordReset.js";

import { auth } from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= AUTH ================= */

// Signup - send OTP
router.post("/signup/send-otp", sendSignupOtp);

// Signup - verify OTP
router.post("/signup/verify-otp", verifySignupOtp);

// Signup - set password
router.post("/signup/set-password", setPassword);

// Login
router.post("/login", login);

// Forgot password
router.post("/forgot-password/send-otp", forgotPasswordSendOtp);
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOtp);
router.post("/forgot-password/reset", forgotPasswordReset);

// Get logged-in user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-passwordHash");

    res.json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
