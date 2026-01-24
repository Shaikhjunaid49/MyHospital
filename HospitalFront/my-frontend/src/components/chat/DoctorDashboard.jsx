import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/API";

// Doctor dashboard
// Shows all appointments assigned to the doctor
const DoctorDashboardComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all doctor appointments from backend
  const fetchDoctorAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor");
      setAppointments(res.data);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  // Update appointment status (confirm / cancel)
  const updateStatus = async (id, status) => {
    await API.patch(`/appointments/${id}/status`, { status });
    fetchDoctorAppointments();
  };

  // Delete appointment after completion or cancellation
  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await API.delete(`/appointments/${id}`);
    fetchDoctorAppointments();
  };

  return <div className="min-h-screen bg-blue-50 p-10">{/* UI unchanged */}</div>;
};

export default DoctorDashboardComponent;
