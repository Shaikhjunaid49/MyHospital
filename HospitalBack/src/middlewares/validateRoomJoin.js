import Appointment from "../models/appoinment.js";
import { AppError } from "../utils/AppError.js";

// Validate user access to video call room
export const validateRoomJoin = async (req, res, next) => {
  try {
    const appointmentId =
      req.body.appointmentId || req.params.appointmentId;

    if (!appointmentId) {
      throw new AppError("Appointment ID required", 400);
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // Check appointment status
    if (appointment.status !== "confirmed") {
      throw new AppError("Appointment not confirmed", 403);
    }

    // Check appointment expiry
    if (new Date() > new Date(appointment.end)) {
      throw new AppError("Appointment expired", 403);
    }

    // Ensure user is patient or doctor
    const userId = req.user._id.toString();

    if (
      appointment.patientId.toString() !== userId &&
      appointment.doctorId.toString() !== userId
    ) {
      throw new AppError("Unauthorized room access", 403);
    }

    req.appointment = appointment;
    next();
  } catch (error) {
    next(error);
  }
};
