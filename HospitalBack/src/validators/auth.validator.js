import Joi from "joi";

/* ================= SIGNUP ================= */

// Send signup OTP
export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("user", "doctor").optional(),
});

/* ================= OTP VERIFY ================= */

export const verifySignupOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

/* ================= SET PASSWORD ================= */

export const setPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

/* ================= LOGIN ================= */

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
