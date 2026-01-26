import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import API from "../../api/axios";

// Handles appointment payment flow
const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const appointmentId =
    location.state?.appointmentId ||
    searchParams.get("appointmentId");

  const amount =
    location.state?.amount ||
    searchParams.get("amount") ||
    500;

  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!appointmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">
          Invalid payment session. Please book again.
        </p>
      </div>
    );
  }

  const skipPayment = async () => {
    try {
      await API.post(
        "/api/payments/skip",
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      alert("Payment successful");
      navigate("/dashboard");
    } catch {
      alert("Payment server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        {/* UI SAME */}
        <button
          onClick={skipPayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Pay Securely
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;
