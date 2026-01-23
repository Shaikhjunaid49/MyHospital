import User from "../models/User.js";
import Appointment from "../models/appoinment.js";
import Service from "../models/service.js";
import { AppError } from "../utils/AppError.js";

/* ================= PROVIDER MANAGEMENT ================= */

// Get all unverified doctors
export const getPendingProvider = async (req, res, next) => {
  try {
    const providers = await User.find({
      role: "doctor",
      isVerified: false,
    }).select("-passwordHash");

    res.json(providers);
  } catch (error) {
    next(new AppError("Failed to fetch providers", 500));
  }
};

// Verify a doctor account
export const verifyProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }

    res.json({
      message: "Doctor verified",
      doctor,
    });
  } catch (error) {
    next(new AppError("Verification failed", 500));
  }
};

// Reject a doctor account
export const rejectProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await User.findByIdAndUpdate(
      id,
      { isVerified: false },
      { new: true }
    );

    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }

    res.json({
      message: "Doctor rejected",
      doctor,
    });
  } catch (error) {
    next(new AppError("Rejection failed", 500));
  }
};

/* ================= SERVICE MANAGEMENT ================= */

// Create a new service
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.json(service);
  } catch (error) {
    next(new AppError("Failed to create service", 500));
  }
};

// Get all services
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate("providerId", "name");

    res.json(services);
  } catch (error) {
    next(new AppError("Failed to fetch services", 500));
  }
};

// Update service details
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    res.json(service);
  } catch (error) {
    next(new AppError("Failed to update service", 500));
  }
};

// Delete a service
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    res.json({ message: "Service deleted" });
  } catch (error) {
    next(new AppError("Failed to delete service", 500));
  }
};

/* ================= APPOINTMENT MANAGEMENT ================= */

// Get appointment list with filters
export const getAppointmentsAdmin = async (req, res, next) => {
  try {
    const { doctor, patient, status, from, to } = req.query;
    const filter = {};

    if (doctor) filter.doctorId = doctor;
    if (patient) filter.patientId = patient;
    if (status) filter.status = status;

    if (from && to) {
      filter.start = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email")
      .populate("serviceId", "title department price");

    res.json(appointments);
  } catch (error) {
    next(new AppError("Failed to fetch appointments", 500));
  }
};

/* ================= DASHBOARD ================= */

// Get admin dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "user" });
    const totalAppointments = await Appointment.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAppointments = await Appointment.countDocuments({
      start: { $gte: today },
    });

    const revenue = await Service.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const monthly = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: "$start" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      todayAppointments,
      revenue: revenue[0]?.total || 0,
      monthly,
    });
  } catch (error) {
    next(new AppError("Failed to fetch dashboard stats", 500));
  }
};
