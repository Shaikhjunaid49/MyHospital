
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

// Handles appointment payment flow
const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get appointment ID from state or query params
  const appointmentId =
    location.state?.appointmentId ||
    searchParams.get("appointmentId");

  // Get payment amount safely
  const amount =
    location.state?.amount ||
    searchParams.get("amount") ||
    500;

  const auth = JSON.parse(localStorage.getItem("auth"));

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
      const res = await fetch(
        "http://localhost:8080/api/payments/skip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ appointmentId }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Payment successful");

      // Redirect user after payment
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

        {/* Payment summary */}
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              Consultation Fee
            </span>
            <span className="font-semibold">
              ₹{amount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">
              Payment Method
            </span>
            <span className="font-semibold">
              UPI / QR
            </span>
          </div>
        </div>

        {/* Development note */}
        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded mb-5">
          Payment gateway is disabled in development mode.
        </div>

        <button
          onClick={skipPayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Pay Securely
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          Your payment is encrypted and secure
        </p>

      </div>
    </div>
  );
};

export default PaymentComponent;
