import express from "express";
import {
  createRoom,
  addSDPRecord,
  endCall,
} from "../controllers/meeting/room.controller.js";

import { auth } from "../middlewares/auth.js";
import { validateRoomJoin } from "../middlewares/validateRoomJoin.js";
import { requirePaidAppointment } from "../middlewares/requirePaidAppointment.js";

const router = express.Router();

/* ================= VIDEO CALL ================= */

// Create video room
router.post(
  "/",
  auth,
  validateRoomJoin,
  requirePaidAppointment,
  createRoom
);

// Save SDP (offer / answer / ICE)
router.post(
  "/:roomId/sdp",
  auth,
  requirePaidAppointment,
  addSDPRecord
);

// End call
router.patch("/:id/end", auth, endCall);

export default router;
