import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await API.post("/auth/forgot-password/send-otp", { email });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-3">Forgot Password</h2>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
