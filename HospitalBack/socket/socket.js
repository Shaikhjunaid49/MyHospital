import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "../src/models/chat.js";

// Initialize socket.io with the HTTP server
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Listen for new socket connections
  io.on("connection", (socket) => {
    const { userId, role } = socket.handshake.auth;

    // Disconnect if authentication data is missing
    if (!userId || !role) {
      socket.disconnect();
      return;
    }

    // Normalize sender role
    const senderRole = role === "doctor" ? "doctor" : "patient";

    /* ================= CHAT ================= */

    // Join appointment-based chat room
    socket.on("joinRoom", async ({ appointmentId }) => {
      if (!appointmentId) return;

      const roomName = `appointment_${appointmentId}`;
      socket.join(roomName);

      // Fetch previous messages for this appointment
      const messages = await Message.find({ appointmentId })
        .sort({ createdAt: 1 })
        .lean();

      // Send formatted message history to the user
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

    // Handle sending a new chat message
    socket.on("sendMessage", async ({ appointmentId, text }) => {
      if (!appointmentId || !text) return;

      const roomName = `appointment_${appointmentId}`;

      // Save message to database
      const message = await Message.create({
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
        senderId: new mongoose.Types.ObjectId(userId),
        senderRole,
        text,
      });

      // Broadcast message to all users in the room
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

    // Join video call room
    socket.on("join-video-room", ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
    });

    // Forward WebRTC offer to other peer
    socket.on("webrtc-offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("webrtc-offer", offer);
    });

    // Forward WebRTC answer to other peer
    socket.on("webrtc-answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("webrtc-answer", answer);
    });

    // Forward ICE candidates for WebRTC connection
    socket.on("webrtc-ice", ({ roomId, candidate }) => {
      socket.to(roomId).emit("webrtc-ice", candidate);
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      // Connection cleanup handled automatically by socket.io
    });
  });

  return io;
};
