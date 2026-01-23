import express from "express";
import { adminOnly } from "../middlewares/admin.middleware.js";
import {
  getPendingProvider,
  verifyProvider,
  rejectProvider,
  createService,
  getServices,
  updateService,
  deleteService,
  getAppointmentsAdmin,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { createProvider } from "../controllers/auth/doctor.creator.js";

const router = express.Router();

/* ================= PROVIDER MANAGEMENT ================= */

// Get all pending doctors
router.get("/providers/pending", adminOnly, getPendingProvider);

// Verify doctor
router.patch("/providers/:id/verify", adminOnly, verifyProvider);

// Reject doctor
router.patch("/providers/:id/reject", adminOnly, rejectProvider);

// Create doctor manually (admin)
router.post("/providers", adminOnly, createProvider);

/* ================= SERVICE MANAGEMENT ================= */

router.post("/service", adminOnly, createService);
router.get("/services", adminOnly, getServices);
router.patch("/service/:id", adminOnly, updateService);
router.delete("/service/:id", adminOnly, deleteService);

/* ================= APPOINTMENTS ================= */

// Get appointments with filters
router.get("/appointments", adminOnly, getAppointmentsAdmin);

/* ================= DASHBOARD ================= */

// Admin dashboard stats
router.get("/dashboard", adminOnly, getDashboardStats);

export default router;
