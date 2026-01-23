import Payment from "../../models/payment.js";
import Appointment from "../../models/appoinment.js";
import { AppError } from "../../utils/AppError.js";

// DEV MODE: Skip Payment
export const skipPayment = async (req, res, next) => {
  try {
    if (process.env.PAYMENT_MODE !== "dev") {
      throw new AppError("Payment skip disabled", 403);
    }

    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);

    const payment = await Payment.create({
      appointmentId,
      userId: req.user._id,
      amount: 0,
      method: "skip",
      status: "paid",
    });

    appointment.paymentStatus = "paid";
    appointment.status = "confirmed";
    await appointment.save();

    res.json({
      message: "Payment skipped (DEV MODE)",
      payment,
    });
  } catch (err) {
    next(err);
  }
};
