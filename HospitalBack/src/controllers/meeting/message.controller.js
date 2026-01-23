import Message from "../../models/chat.js";
import Appointment from "../../models/appoinment.js";
import { AppError } from "../../utils/AppError.js";

/* ================= GET CHAT HISTORY ================= */

// Get all messages for an appointment
export const getMessagesByAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    // Validate appointment ID
    if (!appointmentId) {
      throw new AppError("Appointment ID is required", 400);
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    const userId = req.user._id.toString();

    // Allow only patient or doctor of the appointment
    if (
      appointment.patientId.toString() !== userId &&
      appointment.doctorId.toString() !== userId
    ) {
      throw new AppError("Unauthorized access to chat", 403);
    }

    // Fetch chat messages
    const messages = await Message.find({ appointmentId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name role");

    res.json({
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= SEND MESSAGE ================= */

// Send a new chat message
export const sendMessage = async (req, res, next) => {
  try {
    const { appointmentId, text } = req.body;

    // Validate message text
    if (!text) {
      throw new AppError("Message text is required", 400);
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    const userId = req.user._id.toString();

    // Ensure sender is part of the appointment
    if (
      appointment.patientId.toString() !== userId &&
      appointment.doctorId.toString() !== userId
    ) {
      throw new AppError("Unauthorized", 403);
    }

    // Determine sender role
    const senderRole = req.user.role === "doctor" ? "doctor" : "patient";

    // Save message to database
    const message = await Message.create({
      appointmentId,
      senderId: req.user._id,
      senderRole,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
