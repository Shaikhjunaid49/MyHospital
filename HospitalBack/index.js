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
import { sendEmail } from "./src/utils/sendEmail.js"; // email util

// routes
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import roomRoutes from "./src/routes/room.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import userRoutes from "./src/routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

/* ========= GLOBAL MIDDLEWARES ========= */

// enable CORS
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

// trust proxy (Render)
app.set("trust proxy", 1);

// rate limiting
app.use(limiter);

// parse JSON body
app.use(express.json());

/* ========= DATABASE ========= */

connectDB();

/* ========= TEST EMAIL (TEMP) ========= */
// use this only to test Brevo email
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "junaidsk4901@gmail.com",
      subject: "Brevo Test Email",
      html: "<h2>Email system working ✅</h2>",
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ========= ROUTES ========= */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

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
