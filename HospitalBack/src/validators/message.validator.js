import Joi from "joi";
import mongoose from "mongoose";

// Validate MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

/* ================= SEND MESSAGE ================= */

export const sendMessageSchema = Joi.object({
  appointmentId: objectId.required(),

  text: Joi.string().allow("").optional(),

  attachments: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        type: Joi.string()
          .valid("image", "report", "prescription", "file")
          .required(),
      })
    )
    .optional(),
});
