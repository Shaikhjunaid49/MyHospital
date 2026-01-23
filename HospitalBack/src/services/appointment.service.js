import Appointment from "../models/appoinment.js";
import User from "../models/User.js";
import Room from "../models/call.js";
import { AppError } from "../utils/AppError.js";

/* ================= SLOT OVERLAP CHECK ================= */

// Check if doctor already has an appointment in this time slot
export const checkSlotOverlap = async (doctorId, start, end) => {
  const overlap = await Appointment.findOne({
    doctorId,
    start: { $lt: end },
    end: { $gt: start },
  });

  if (overlap) {
    throw new AppError("This time slot is already booked", 400);
  }
};

/* ================= DOCTOR AVAILABILITY ================= */

// Check if doctor is available on given day and time
export const checkDoctorAvailability = (doctor, start, end) => {
  // Allow booking if availability is not configured
  if (
    !doctor.availability ||
    !Array.isArray(doctor.availability) ||
    doctor.availability.length === 0
  ) {
    return true;
  }

  const day = start.toLocaleString("en-US", { weekday: "long" });

  const dayAvailability = doctor.availability.find(
    (a) => a.day === day && Array.isArray(a.slots)
  );

  if (!dayAvailability) {
    throw new AppError(`Doctor is not available on ${day}`, 400);
  }

  const reqStart = start.getHours() * 60 + start.getMinutes();
  const reqEnd = end.getHours() * 60 + end.getMinutes();

  const isSlotValid = dayAvailability.slots.some((slot) => {
    const slotStart =
      parseInt(slot.start.split(":")[0]) * 60 +
      parseInt(slot.start.split(":")[1]);

    const slotEnd =
      parseInt(slot.end.split(":")[0]) * 60 +
      parseInt(slot.end.split(":")[1]);

    return reqStart >= slotStart && reqEnd <= slotEnd;
  });

  if (!isSlotValid) {
    throw new AppError("Doctor not available in this time slot", 400);
  }
};

/* ================= STATUS FLOW VALIDATION ================= */

// Validate appointment status transitions
export const validateStatusFlow = (current, next) => {
  const allowed = {
    pending: ["confirmed", "canceled"],
    confirmed: ["completed", "canceled"],
    completed: [],
    canceled: [],
  };

  if (!allowed[current]?.includes(next)) {
    throw new AppError(
      `Cannot change status from ${current} → ${next}`,
      400
    );
  }
};

/* ================= MEETING ROOM ================= */

// Create meeting room for appointment
export const createMeetingRoom = async (doctorId, patientId) => {
  const room = await Room.create({
    participants: [doctorId, patientId],
  });

  return room._id;
};

/* ================= CREATE APPOINTMENT ================= */

// Main appointment creation logic
export const createAppointmentService = async (data) => {
  const {
    patientId,
    doctorId,
    serviceId,
    department,
    consultationType,
    start,
    end,
    symptoms,
  } = data;

  // Check doctor exists
  const doctor = await User.findById(doctorId);
  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  // Check slot overlap
  await checkSlotOverlap(doctorId, start, end);

  // Check doctor availability
  checkDoctorAvailability(doctor, new Date(start), new Date(end));

  // Create meeting room
  const meetingRoomId = await createMeetingRoom(
    doctorId,
    patientId
  );

  // Create appointment
  const appointment = await Appointment.create({
    patientId,
    doctorId,
    serviceId,
    department,
    consultationType,
    start,
    end,
    status: "pending",
    meetingRoomId,
    paymentStatus: "pending",
    symptoms,
  });

  return appointment;
};

/* ================= UPDATE APPOINTMENT STATUS ================= */

// Update appointment status safely
export const updateAppointmentStatusService = async (id, newStatus) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  // Validate status transition
  validateStatusFlow(appointment.status, newStatus);

  appointment.status = newStatus;
  await appointment.save();

  return appointment;
};
