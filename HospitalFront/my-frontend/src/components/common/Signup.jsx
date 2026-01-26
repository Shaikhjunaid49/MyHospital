import { useState } from "react";
import { User, Stethoscope } from "lucide-react";
import API from "../../api/axios";

// Signup component with OTP verification
const SignupComponent = () => {
  const [role, setRole] = useState("user");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    otp: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/api/auth/signup/send-otp", {
        name: form.name,
        email: form.email,
        role,
        specialization: form.specialization,
        experience: form.experience,
      });

      setStep(2);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/api/auth/signup/verify-otp", {
        email: form.email,
        otp: form.otp,
      });

      setStep(3);
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const setPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/api/auth/signup/set-password", {
        email: form.email,
        password: form.password,
      });

      alert("Signup successful! Please login.");
    } catch {
      alert("Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        {/* UI SAME AS YOUR ORIGINAL */}
      </div>
    </div>
  );
};

export default SignupComponent;
