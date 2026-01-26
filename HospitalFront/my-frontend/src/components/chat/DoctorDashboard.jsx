import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const DoctorDashboardComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchDoctorAppointments = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) return navigate("/login");

    const res = await API.get("/appointments/doctor", {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    setAppointments(res.data || []);
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      {/* UI unchanged */}
    </div>
  );
};

export default DoctorDashboardComponent;
