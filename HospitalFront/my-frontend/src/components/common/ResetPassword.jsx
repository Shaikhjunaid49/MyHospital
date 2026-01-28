import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/axios";

const ResetPasswordComponent = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const resetPassword = async () => {
    try {
      await API.post("/auth/forgot-password/verify-otp", {
        email,
        otp,
      });

      await API.post("/auth/forgot-password/reset", {
        email,
        password,
      });

      alert("Password changed successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-3">Reset Password</h2>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={resetPassword}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
