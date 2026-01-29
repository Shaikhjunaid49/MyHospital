import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Limit repeated requests from same IP (Render + IPv6 safe)
export const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,

  // Correct way to handle IPv4 + IPv6
  keyGenerator: ipKeyGenerator,
});
