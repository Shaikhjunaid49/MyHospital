import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  getDoctorAppointments,
} from "../controllers/meeting/appointment.controller.js";

import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../validators/appointment.validator.js";

const router = express.Router();

/* ================= APPOINTMENTS ================= */

// Create appointment
router.post(
  "/",
  auth,
  validate(createAppointmentSchema),
  createAppointment
);

// Get doctor's appointments
router.get("/doctor", auth, getDoctorAppointments);

// Get patient's appointments
router.get("/", auth, getAllAppointments);

// Get appointment by ID
router.get("/:id", auth, getAppointmentById);

// Update appointment status
router.patch(
  "/:id/status",
  auth,
  validate(updateAppointmentStatusSchema),
  updateAppointment
);

export default router;
