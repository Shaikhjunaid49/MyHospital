import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const auth = JSON.parse(localStorage.getItem("auth"));

    try {
      const res = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          doctorId: form.doctorId,
          serviceId: form.serviceId,
          start,
          end,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Redirect user to payment page
      const appointmentId = data.appointment._id;
      const amount = selectedService.price;

      navigate(`/payment?appointmentId=${appointmentId}&amount=${amount}`, {
        state: { appointmentId, amount },
      });
    } catch {
      alert("Server error");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-700">
          Book an Appointment
        </h1>

        {/* Service selection */}
        {!showForm && (
          <div className="grid md:grid-cols-3 gap-6">
            {treatments.map((t) => (
              <div key={t._id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold">{t.title}</h3>
                <p className="text-gray-500 mb-4">₹{t.price}</p>
                <button
                  onClick={() => handleBookClick(t)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Appointment form */}
        {showForm && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <p className="mb-4">
              Service: <b>{selectedService?.title}</b>
            </p>

            <input
              type="date"
              className="w-full border p-3 mb-3"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <select
              className="w-full border p-3 mb-3"
              onChange={(e) =>
                setForm({ ...form, doctorId: e.target.value })
              }
            >
              <option value="">Choose doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            <input
              placeholder="10:00"
              className="w-full border p-3 mb-4"
              onChange={(e) =>
                setForm({ ...form, timeSlot: e.target.value })
              }
            />

            <button
              onClick={bookAppointment}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Confirm & Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentComponent;