import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AppointmentComponent = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [form, setForm] = useState({
    date: "",
    doctorId: "",
    serviceId: "",
    timeSlot: "",
  });

  // Fetch services and doctors from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get services
        const servicesRes = await API.get("/services");

        // Ensure services is always an array
        const servicesData = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : servicesRes.data.services || [];

        setServices(servicesData);

        // Get doctors
        const doctorsRes = await API.get("/users/doctors");

       const doctorsData = doctorsRes.data.data || [];

        setDoctors(doctorsData);

      } catch (error) {
        console.error(error);
        alert("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // Build start and end time
  const buildStartEnd = (date, timeSlot) => {
    const start = new Date(`${date} ${timeSlot}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return { start, end };
  };

  // When user clicks Book button
  const handleBookClick = (service) => {
    setSelectedService(service);
    setForm({
      ...form,
      serviceId: service._id,
    });
    setShowForm(true);
  };

  // Book appointment
  const bookAppointment = async () => {
    if (!form.date || !form.doctorId || !form.timeSlot) {
      alert("Please fill all fields");
      return;
    }

    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth || !auth.token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const { start, end } = buildStartEnd(form.date, form.timeSlot);

    try {
      await API.post(
        "/appointments",
        {
          doctorId: form.doctorId,
          serviceId: form.serviceId,
          start,
          end,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      alert("Appointment booked successfully");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Appointment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-700">
          Book an Appointment
        </h1>

        {/* Show services */}
        {!showForm && (
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white p-6 rounded-xl shadow"
              >
                <h3 className="text-lg font-semibold">
                  {service.title || service.name}
                </h3>

                <p className="text-gray-500 mb-4">
                  ₹{service.price}
                </p>

                <button
                  onClick={() => handleBookClick(service)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking form */}
        {showForm && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <p className="mb-4">
              Service: <b>{selectedService?.title || selectedService?.name}</b>
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
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
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
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentComponent;