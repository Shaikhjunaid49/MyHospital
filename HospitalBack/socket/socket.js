import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "../src/models/chat.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ALLOWED_ORIGINS
        ? process.env.CORS_ALLOWED_ORIGINS.split(",")
        : [],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    const { userId, role } = socket.handshake.auth || {};

    // ❗ AUTH VALIDATION (VERY IMPORTANT)
    if (!userId || !role) {
      console.log("🔴 Socket rejected: missing auth");
      socket.disconnect();
      return;
    }

    const senderRole = role === "doctor" ? "doctor" : "patient";

    /* ================= CHAT ================= */

    socket.on("joinRoom", async ({ appointmentId }) => {
      if (!appointmentId) return;

      const roomName = `appointment_${appointmentId}`;
      socket.join(roomName);

      console.log(`🟢 User joined room: ${roomName}`);

      const messages = await Message.find({ appointmentId })
        .sort({ createdAt: 1 })
        .lean();

      socket.emit(
        "recentMessages",
        messages.map((m) => ({
          ...m,
          _id: m._id.toString(),
          senderId: m.senderId.toString(),
          appointmentId: m.appointmentId.toString(),
        }))
      );
    });

    socket.on("sendMessage", async ({ appointmentId, text }) => {
      if (!appointmentId || !text) return;

      const roomName = `appointment_${appointmentId}`;

      const message = await Message.create({
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
        senderId: new mongoose.Types.ObjectId(userId),
        senderRole,
        text,
      });

      io.to(roomName).emit("newMessage", {
        _id: message._id.toString(),
        appointmentId,
        senderId: userId,
        senderRole,
        text,
        createdAt: message.createdAt,
      });
    });

    /* ================= VIDEO CALL ================= */

    socket.on("join-video-room", ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
    });

    socket.on("webrtc-offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("webrtc-offer", offer);
    });

    socket.on("webrtc-answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("webrtc-answer", answer);
    });

    socket.on("webrtc-ice", ({ roomId, candidate }) => {
      socket.to(roomId).emit("webrtc-ice", candidate);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};
