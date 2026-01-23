import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 

    description: { type: String },

    department: { type: String, required: true }, 

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    price: { type: Number, required: true },

    duration: { type: Number, required: true },
    tags: [{ type: String }],
    images: [
      {
        url: String,
        alt: String,
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
