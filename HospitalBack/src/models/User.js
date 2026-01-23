import mongoose from "mongoose";

// Slot Schema (for doctor's timing)
const SlotSchema = new mongoose.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
});

// Weekly Availability Schema
const AvailabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        enum: [
            "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday", "Sunday"
        ],
        required: true,
    },
    slots: [SlotSchema],
});

// Main User Schema
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
        isOtpVerified: {
            type: Boolean,
            default: false,
        },

        // user roles: normal user, doctor, admin
        role: {
            type: String,
            enum: ["user", "doctor", "admin"],
            default: "user",
        },

        // Only for doctors
        availability: [AvailabilitySchema],

        specialization: {
            type: String,
            required: function () {
                return this.role === "doctor";
            },
        },

        experience: {
            type: Number,
            default: 0,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// ES MODULE EXPORT
const User = mongoose.model("User", UserSchema);
export default User;
