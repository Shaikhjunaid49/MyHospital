import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import API from "../../api/axios";

// Payment component (SKIP payment flow)
const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get appointment id
  const appointmentId =
    location.state?.appointmentId ||
    searchParams.get("appointmentId");

  // Get amount
  const amount =
    location.state?.amount ||
    searchParams.get("amount") ||
    500;

  const auth = JSON.parse(localStorage.getItem("auth"));

  // Safety checks
  if (!appointmentId) {
    return <p>Invalid payment session</p>;
  }

  if (!auth || !auth.token) {
    return <p>Session expired. Please login again.</p>;
  }

  // Skip payment (dev mode)
  const skipPayment = async () => {
    try {
      await API.post(
        "/payments/skip",
        { appointmentId, amount },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      alert("Payment successful");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={skipPayment}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Pay Securely
      </button>
    </div>
  );
};

export default PaymentComponent;
