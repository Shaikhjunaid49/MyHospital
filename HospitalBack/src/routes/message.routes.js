import express from "express";
import {
  getMessagesByAppointment,
  sendMessage,
} from "../controllers/meeting/message.controller.js";

import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { sendMessageSchema } from "../validators/message.validator.js";
import { requirePaidAppointment } from "../middlewares/requirePaidAppointment.js";

const router = express.Router();

/* ================= CHAT ================= */

// Get chat messages (paid & confirmed appointment)
router.get(
  "/appointment/:appointmentId",
  auth,
  requirePaidAppointment,
  getMessagesByAppointment
);

// Send message (paid & confirmed appointment)
router.post(
  "/",
  auth,
  validate(sendMessageSchema),
  requirePaidAppointment,
  sendMessage
);

export default router;
