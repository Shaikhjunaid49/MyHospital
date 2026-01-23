import bcrypt from "bcrypt";
import User from "../../models/User.js";

// Create a new doctor (provider) account
export const createProvider = async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;

    // Check if a user with the same email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Encrypt password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Create doctor account
    const provider = await User.create({
      name,
      email,
      passwordHash,
      role: "doctor",
      department,
      specialization: department,
      isOtpVerified: true,
      isVerified: true,
    });

    // Send success response
    res.status(201).json({
      message: "Doctor created successfully",
      provider,
    });
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: "Failed to create provider" });
  }
};
