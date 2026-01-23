import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

// Authenticate user using JWT
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Unauthorized: No token provided", 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      throw new AppError("Invalid token", 401);
    }

    // Fetch user and attach to request
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      throw new AppError("User not found or deleted", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Authentication failed", 401));
  }
};
