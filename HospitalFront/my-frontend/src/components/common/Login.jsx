import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const LoginComponent = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.user);

      if (res.data.user.role === "doctor") navigate("/doctor");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center">
      {/* UI unchanged */}
    </div>
  );
};

export default LoginComponent;
