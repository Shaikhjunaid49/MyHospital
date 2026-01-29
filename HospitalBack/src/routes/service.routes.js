import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/meeting/service.controller.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

/* ================= SERVICES ================= */

router.post("/",  createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);

export default router;
