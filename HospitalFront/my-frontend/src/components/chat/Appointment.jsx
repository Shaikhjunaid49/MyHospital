import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// Handles appointment booking flow for users
const AppointmentComponent = () => {
  const navigate = useNavigate();

  // UI states
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Selected service for booking
  const [selectedService, setSelectedService] = useState(null);

  // Appointment form data
  const [form, setForm] = useState({
    date: "",
    doctorId: "",
    serviceId: "",
    timeSlot: "",
  });

  // Creates start and end time from date + time slot
  const buildStartEnd = (date, timeSlot) => {
    const start = new Date(`${date} ${timeSlot}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min slot
    return { start, end };
  };

  // Temporary service list (will come from backend later)
  const treatments = [
    { _id: "6948036d87e94984ab24496a", title: "General Checkup", price: 500 },
    { _id: "6948036d87e94984ab24496b", title: "Dental Checkup", price: 800 },
    { _id: "6948036d87e94984ab24496c", title: "Eye Checkup", price: 600 },
  ];

  // Temporary doctor list
  const doctors = [
    { _id: "6949632cb3d0503fa079d035", name: "Dr. Ayesha Khan" },
    { _id: "6942a11449434c0cf2d63d1e", name: "Dr. Zain" },
    { _id: "6942a13c49434c0cf2d63d20", name: "Dr. Patel" },
  ];

  // Stop loading on component mount
  useEffect(() => {
    setLoading(false);
  }, []);

  // When user clicks "Book Appointment"
  const handleBookClick = (service) => {
    setSelectedService(service);
    setForm({ ...form, serviceId: service._id });
    setShowForm(true);
  };

  // Sends appointment data to backend
  const bookAppointment = async () => {
    if (!form.date || !form.doctorId || !form.timeSlot) {
      alert("Please fill all fields");
      return;
    }

    const { start, end } = buildStartEnd(form.date, form.timeSlot);

    try {
      const res = await API.post("/appointments", {
        doctorId: form.doctorId,
        serviceId: form.serviceId,
        start,
        end,
      });

      const appointmentId = res.data.appointment._id;
      const amount = selectedService.price;

      navigate(`/payment?appointmentId=${appointmentId}&amount=${amount}`, {
        state: { appointmentId, amount },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* UI unchanged */}
    </div>
  );
};

export default AppointmentComponent;
