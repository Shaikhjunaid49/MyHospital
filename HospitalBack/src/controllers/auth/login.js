import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";

// Handle user login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new AppError("Email and password required", 400);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 400);
    }

    // Check if user has completed signup
    if (user.passwordHash === "temp") {
      throw new AppError(
        "Please complete signup and set your password",
        400
      );
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Incorrect password", 400);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send login response
    res.json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};
