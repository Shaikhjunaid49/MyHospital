import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const UserDashboardComponent = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) return navigate("/login");

    const res = await API.get("/appointments", {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    setAppointments(res.data || []);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-10">
      {/* UI unchanged */}
    </div>
  );
};

export default UserDashboardComponent;
