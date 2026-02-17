import {
  createAppointmentService,
  updateAppointmentStatusService,
} from "../../services/appointment.service.js";

import Appointment from "../../models/appoinment.js";
import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { sendEmail } from "../../utils/sendEmail.js";

// Create appointment
export const createAppointment = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      patientId: req.user._id, // logged-in patient
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

// Get patient appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const data = await Appointment.find({
      patientId: req.user._id,
    })
      .populate("doctorId", "name email")
      .populate("serviceId", "title price")
      .sort({ start: -1 });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Get doctor appointments
export const getDoctorAppointments = async (req, res, next) => {
  try {
    const data = await Appointment.find({
      doctorId: req.user._id,
    })
      .populate("patientId", "name email")
      .populate("serviceId", "title price")
      .sort({ start: 1 });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Get single appointment
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

// Update appointment status
export const updateAppointment = async (req, res, next) => {
  try {
    const updated = await updateAppointmentStatusService(
      req.params.id,
      req.body.status
    );

    // Send email when confirmed
    if (req.body.status === "confirmed") {
      const patient = await User.findById(updated.patientId);
      const doctor = await User.findById(updated.doctorId);

      await sendEmail({
        to: patient.email,
        subject: "Appointment Confirmed",
        html: `
          <h2>Appointment Confirmed</h2>
          <p>Hello ${patient.name}</p>
          <p>Your appointment with Dr. ${doctor.name} is confirmed.</p>
          <p>Date: ${new Date(updated.start).toLocaleString()}</p>
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
