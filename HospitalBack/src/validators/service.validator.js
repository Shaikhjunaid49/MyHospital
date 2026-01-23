import Joi from "joi";
import mongoose from "mongoose";

// Validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

/* ================= CREATE SERVICE ================= */

export const createServiceSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().optional(),

  department: Joi.string().required(),

  price: Joi.number().positive().required(),
  duration: Joi.number().positive().required(),

  tags: Joi.array().items(Joi.string()).optional(),

  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        alt: Joi.string().optional(),
      })
    )
    .optional(),
});
