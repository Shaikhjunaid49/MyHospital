import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// Login page
const LoginComponent = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.user);

      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else if (res.data.user.role === "doctor") navigate("/doctor");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-green-50">{/* UI unchanged */}</div>;
};

export default LoginComponent;
