import {
  createAppointmentService,
  updateAppointmentStatusService,
} from "../../services/appointment.service.js";

import Appointment from "../../models/appoinment.js";
import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { sendEmail } from "../../utils/sendEmail.js";

/* ================= CREATE APPOINTMENT ================= */

// Create a new appointment for logged-in patient
export const createAppointment = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      patientId: req.user._id,
    };

    const appointment = await createAppointmentService(data);

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET APPOINTMENTS ================= */

// Get all appointments for patient
export const getAllAppointments = async (req, res, next) => {
  try {
    const data = await Appointment.find({ patientId: req.user._id })
      .populate("doctorId", "name email")
      .populate("serviceId", "title price")
      .sort({ start: -1 });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Get all appointments for doctor
export const getDoctorAppointments = async (req, res, next) => {
  try {
    const data = await Appointment.find({ doctorId: req.user._id })
      .populate("patientId", "name email")
      .populate("serviceId", "title price")
      .sort({ start: 1 });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .populate("serviceId", "title price");

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE APPOINTMENT STATUS ================= */

// Update appointment status (confirmed / canceled / completed)
export const updateAppointment = async (req, res, next) => {
  try {
    const updated = await updateAppointmentStatusService(
      req.params.id,
      req.body.status
    );

    // Send confirmation email only when appointment is confirmed
    if (req.body.status === "confirmed") {
      const patient = await User.findById(updated.patientId);
      const doctor = await User.findById(updated.doctorId);

      await sendEmail({
        to: patient.email,
        subject: "Appointment Confirmed",
        html: `
          <h2>Appointment Confirmed</h2>
          <p>Hello ${patient.name},</p>
          <p>Your appointment with Dr. ${doctor.name} has been confirmed.</p>
          <p><b>Date:</b> ${new Date(updated.start).toLocaleString()}</p>
        `,
      });
    }

    res.json({
      message: "Status updated successfully",
      updated,
    });
  } catch (error) {
    next(error);
  }
};
