import User from "../models/User.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", isVerified: true })
      .select("name email specialization");

    res.status(200).json({
      status: "success",
      results: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
