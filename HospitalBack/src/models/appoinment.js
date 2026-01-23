import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    department: {
      type: String,
      required: false,
    },

    consultationType: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    start: { type: Date, required: true },
    end: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "completed"],
      default: "pending",
    },

    meetingRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room", 
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    symptoms: { type: String },// patient input 
    notes: { type: String }, //doctor medecince
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
