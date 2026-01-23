import express from "express";
import { skipPayment } from "../controllers/payment/payment.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Skip payment (temporary / testing feature)
router.post("/skip", auth, skipPayment);

export default router;
