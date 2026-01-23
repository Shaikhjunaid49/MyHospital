import Room from "../../models/call.js";
import Appointment from "../../models/appoinment.js";
import { AppError } from "../../utils/AppError.js";

/* ================= CREATE ROOM ================= */

// Create a video call room for an appointment
export const createRoom = async (req, res, next) => {
  try {
    const { appointmentId } = req.body;

    // Validate appointment ID
    if (!appointmentId) {
      throw new AppError("Appointment ID is required", 400);
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // Check if an active room already exists
    const existingRoom = await Room.findOne({
      appointmentId,
      isActive: true,
    });

    if (existingRoom) {
      return res.json({
        message: "Room already exists",
        room: existingRoom,
      });
    }

    // Create new room with patient and doctor
    const room = await Room.create({
      appointmentId,
      participants: [
        appointment.patientId,
        appointment.doctorId,
      ],
      isActive: true,
    });

    res.status(201).json({
      message: "Room created",
      room,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= SAVE SDP RECORD ================= */

// Store WebRTC SDP data for a room
export const addSDPRecord = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      throw new AppError("Room not found", 404);
    }

    room.sdpRecords.push(req.body);
    await room.save();

    res.json({
      message: "SDP record saved",
      room,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= END CALL ================= */

// End an active video call
export const endCall = async (req, res, next) => {
  try {
    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({
      message: "Call ended",
      updated,
    });
  } catch (error) {
    next(error);
  }
};
