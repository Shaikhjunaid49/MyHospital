import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import connectDB from "./src/config/db.js";
import { initSocket } from "./socket/socket.js";
import { limiter } from "./src/middlewares/rateLimiter.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import logger from "./src/config/logger.js";
import { corsOptions } from "./src/config/cors.js";

// routes
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import roomRoutes from "./src/routes/room.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

/* ========= GLOBAL MIDDLEWARES ========= */

// enable CORS (FINAL FIX)
app.use(cors(corsOptions));

// security headers
app.use(helmet());

// compress responses
app.use(compression());

// logging
if (process.env.NODE_ENV === "production") {
  app.use(
    morgan("combined", {
      stream: {
        write: (msg) => logger.info(msg.trim()),
      },
    })
  );
} else {
  app.use(morgan("dev"));
}

// rate limiting
app.use(limiter);

// parse JSON body
app.use(express.json());

/* ========= DATABASE ========= */

connectDB();

/* ========= ROUTES ========= */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);

/* ========= HEALTH CHECK ========= */

app.get("/", (req, res) => {
  res.json({ message: "Server running successfully" });
});

/* ========= ERROR HANDLER ========= */

app.use(errorHandler);

/* ========= SERVER & SOCKET ========= */

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
