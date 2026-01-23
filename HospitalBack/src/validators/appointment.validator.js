import Joi from "joi";
import mongoose from "mongoose";

// Validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

/* ================= CREATE APPOINTMENT ================= */

export const createAppointmentSchema = Joi.object({
  doctorId: objectId.required(),
  serviceId: objectId.required(),

  department: Joi.string().optional(),

  consultationType: Joi.string()
    .valid("online", "offline")
    .default("offline"),

  start: Joi.date().required(),
  end: Joi.date().greater(Joi.ref("start")).required(),

  symptoms: Joi.string().optional(),
});

/* ================= UPDATE STATUS ================= */

export const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "canceled", "completed")
    .required(),
});
