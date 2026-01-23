import Appointment from "../models/appoinment.js";
import { AppError } from "../utils/AppError.js";

// Ensure appointment is paid and confirmed
export const requirePaidAppointment = async (req, res, next) => {
  try {
    const appointmentId =
      req.body.appointmentId ||
      req.params.appointmentId ||
      req.params.id;

    if (!appointmentId) {
      throw new AppError("Appointment ID is required", 400);
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // Check payment status
    if (appointment.paymentStatus !== "paid") {
      throw new AppError(
        "Payment required to access this feature",
        403
      );
    }

    // Check appointment status
    if (appointment.status !== "confirmed") {
      throw new AppError(
        "Appointment is not confirmed yet",
        403
      );
    }

    req.appointment = appointment;
    next();
  } catch (error) {
    next(error);
  }
};
