import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// Handles appointment booking flow for users
const AppointmentComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [form, setForm] = useState({
    date: "",
    doctorId: "",
    serviceId: "",
    timeSlot: "",
  });

  const buildStartEnd = (date, timeSlot) => {
    const start = new Date(`${date} ${timeSlot}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return { start, end };
  };

  const treatments = [
    { _id: "6948036d87e94984ab24496a", title: "General Checkup", price: 500 },
    { _id: "6948036d87e94984ab24496b", title: "Dental Checkup", price: 800 },
    { _id: "6948036d87e94984ab24496c", title: "Eye Checkup", price: 600 },
  ];

  const doctors = [
    { _id: "6949632cb3d0503fa079d035", name: "Dr. Ayesha Khan" },
    { _id: "6942a11449434c0cf2d63d1e", name: "Dr. Zain" },
    { _id: "6942a13c49434c0cf2d63d20", name: "Dr. Patel" },
  ];

  useEffect(() => setLoading(false), []);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setForm({ ...form, serviceId: service._id });
    setShowForm(true);
  };

  const bookAppointment = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) return alert("Login required");

    const { start, end } = buildStartEnd(form.date, form.timeSlot);

    try {
      const res = await API.post(
        "/appointments",
        {
          doctorId: form.doctorId,
          serviceId: form.serviceId,
          start,
          end,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      navigate(`/payment`, {
        state: {
          appointmentId: res.data.appointment._id,
          amount: selectedService.price,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* UI unchanged */}
    </div>
  );
};

export default AppointmentComponent;
