import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    isActive: { type: Boolean, default: false },

    sdpRecords: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        offer: Object,
        answer: Object,
        iceCandidates: Array,
      }
    ],

    recordingUrl: { type: String },

    activeCallLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CallLog",
    }

  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
