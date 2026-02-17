import Appointment from "../models/appoinment.js";
import User from "../models/User.js";
import Room from "../models/call.js";
import { AppError } from "../utils/AppError.js";

// Check if doctor already has an appointment in this time slot
export const checkSlotOverlap = async (doctorId, startDate, endDate) => {
  const overlap = await Appointment.findOne({
    doctorId,
    start: { $lt: endDate },
    end: { $gt: startDate },
  });

  if (overlap) {
    throw new AppError("This time slot is already booked", 400);
  }
};

// Check if doctor is available on given day and time
export const checkDoctorAvailability = (doctor, startDate, endDate) => {
  if (
    !doctor.availability ||
    !Array.isArray(doctor.availability) ||
    doctor.availability.length === 0
  ) {
    return true;
  }

  const day = startDate.toLocaleString("en-US", { weekday: "long" });

  const dayAvailability = doctor.availability.find(
    (a) => a.day === day && Array.isArray(a.slots)
  );

  if (!dayAvailability) {
    throw new AppError(`Doctor is not available on ${day}`, 400);
  }

  const reqStart = startDate.getHours() * 60 + startDate.getMinutes();
  const reqEnd = endDate.getHours() * 60 + endDate.getMinutes();

  const isSlotValid = dayAvailability.slots.some((slot) => {
    const [startHour, startMin] = slot.start.split(":").map(Number);
    const [endHour, endMin] = slot.end.split(":").map(Number);

    const slotStart = startHour * 60 + startMin;
    const slotEnd = endHour * 60 + endMin;

    return reqStart >= slotStart && reqEnd <= slotEnd;
  });

  if (!isSlotValid) {
    throw new AppError("Doctor not available in this time slot", 400);
  }
};

// Create meeting room for appointment
export const createMeetingRoom = async (doctorId, patientId) => {
  const room = await Room.create({
    participants: [doctorId, patientId],
  });

  return room._id;
};

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

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new AppError("Invalid date or time format", 400);
  }

  if (startDate >= endDate) {
    throw new AppError("Invalid time slot", 400);
  }

  const doctor = await User.findById(doctorId);

  if (!doctor || doctor.role !== "doctor") {
    throw new AppError("Doctor not found", 404);
  }

  await checkSlotOverlap(doctorId, startDate, endDate);

  checkDoctorAvailability(doctor, startDate, endDate);

  const meetingRoomId = await createMeetingRoom(
    doctorId,
    patientId
  );

  const appointment = await Appointment.create({
    patientId,
    doctorId,
    serviceId,
    department,
    consultationType,
    start: startDate,
    end: endDate,
    status: "pending",
    meetingRoomId,
    paymentStatus: "pending",
    symptoms,
  });

  return appointment;
};

// Validate status transitions
const validateStatusFlow = (current, next) => {
  const allowed = {
    pending: ["confirmed", "canceled"],
    confirmed: ["completed", "canceled"],
    completed: [],
    canceled: [],
  };

  if (!allowed[current]?.includes(next)) {
    throw new AppError(
      `Cannot change status from ${current} to ${next}`,
      400
    );
  }
};

// Update appointment status safely
export const updateAppointmentStatusService = async (id, newStatus) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  validateStatusFlow(appointment.status, newStatus);

  appointment.status = newStatus;
  await appointment.save();

  return appointment;
};
