import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// User dashboard
// Shows user's booked appointments
const UserDashboardComponent = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await API.delete(`/appointments/${id}`);
    fetchAppointments();
  };

  return <div className="min-h-screen bg-green-50 p-10">{/* UI unchanged */}</div>;
};

export default UserDashboardComponent;
