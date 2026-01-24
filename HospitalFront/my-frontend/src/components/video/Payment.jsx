import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import API from "../../api/API";

// Handles appointment payment flow
const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const appointmentId =
    location.state?.appointmentId || searchParams.get("appointmentId");

  const amount =
    location.state?.amount || searchParams.get("amount") || 500;

  // Invalid access protection
  if (!appointmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">
          Invalid payment session. Please book again.
        </p>
      </div>
    );
  }

  // Skip payment and mark appointment as paid
  const skipPayment = async () => {
    try {
      await API.post("/payments/skip", { appointmentId });
      alert("Payment successful");
      navigate("/dashboard");
    } catch {
      alert("Payment server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center mb-2">
          Complete Payment
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Secure hospital payment
        </p>

        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="font-semibold">₹{amount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-semibold">UPI / QR</span>
          </div>
        </div>

        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded mb-5">
          Payment gateway is disabled in development mode.
        </div>

        <button
          onClick={skipPayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Pay Securely
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;
