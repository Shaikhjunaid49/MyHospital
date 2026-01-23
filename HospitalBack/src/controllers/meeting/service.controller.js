import Service from "../../models/service.js";
import { AppError } from "../../utils/AppError.js";

/* ================= CREATE SERVICE ================= */

// Create a new service
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      message: "Service created",
      service,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET SERVICES ================= */

// Get all services
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate("providerId", "name email");

    res.json(services);
  } catch (error) {
    next(error);
  }
};

// Get a single service by ID
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE SERVICE ================= */

// Update service details
export const updateService = async (req, res, next) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Service updated",
      updated,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE SERVICE ================= */

// Delete a service
export const deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);

    res.json({
      message: "Service deleted",
    });
  } catch (error) {
    next(error);
  }
};
