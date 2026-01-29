import rateLimit from "express-rate-limit";

// Limit repeated requests from same IP (Render safe)
export const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,

  // Tell rate-limit to respect trusted proxy
  keyGenerator: (req) => {
    return req.ip;
  },
});
