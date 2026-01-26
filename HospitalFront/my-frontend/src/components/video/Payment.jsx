import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";

const PaymentComponent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const auth = JSON.parse(localStorage.getItem("auth"));

  const skipPayment = async () => {
    await API.post(
      "/payments/skip",
      { appointmentId: state.appointmentId },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* UI unchanged */}
    </div>
  );
};

export default PaymentComponent;
