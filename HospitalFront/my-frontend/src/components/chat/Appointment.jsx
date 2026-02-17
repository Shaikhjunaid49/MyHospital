import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AppointmentComponent = () => {
  const navigate = useNavigate();

  // step number (1 to 4)
  const [step, setStep] = useState(1);

  // store services and doctors
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // loading state
  const [loading, setLoading] = useState(false);

  // form data
  const [form, setForm] = useState({
    serviceId: "",
    doctorId: "",
    date: "",
    timeSlot: "",
  });

  // get auth from localStorage
  const auth = JSON.parse(localStorage.getItem("auth"));

  // get services and doctors from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await API.get("/services");

        // check if response is array
        const servicesData = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : servicesRes.data.services || [];

        setServices(servicesData);

        const doctorsRes = await API.get("/users/doctors");
        setDoctors(doctorsRes.data.data || []);
      } catch (error) {
        alert("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // create start and end time (30 min slot)
  const buildStartEnd = (date, timeSlot) => {
    const start = new Date(`${date}T${timeSlot}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return { start, end };
  };

  // book appointment
  const bookAppointment = async () => {
    // check if all fields filled
    if (!form.serviceId || !form.doctorId || !form.date || !form.timeSlot) {
      return alert("Please fill all fields");
    }

    // check login
    if (!auth || !auth.token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const { start, end } = buildStartEnd(form.date, form.timeSlot);

    try {
      setLoading(true);

      // send request to backend
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

      // go to done step
      setStep(4);
    } catch (error) {
      alert(error.response?.data?.message || "Time slot not available");
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">

        {/* step indicator */}
        <div className="flex justify-between mb-6 text-sm font-semibold">
          <span className={step >= 1 ? "text-green-600" : "text-gray-400"}>
            Service
          </span>
          <span className={step >= 2 ? "text-green-600" : "text-gray-400"}>
            Time
          </span>
          <span className={step >= 3 ? "text-green-600" : "text-gray-400"}>
            Confirm
          </span>
          <span className={step === 4 ? "text-green-600" : "text-gray-400"}>
            Done
          </span>
        </div>

        {/* step 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Select Service</h2>

            <select
              className="w-full border p-3 mb-4"
              onChange={(e) =>
                setForm({ ...form, serviceId: e.target.value })
              }
            >
              <option value="">Choose Service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.title || service.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (!form.serviceId) return alert("Select service");
                setStep(2);
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Next
            </button>
          </>
        )}

        {/* step 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Choose Date & Time</h2>

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
              <option value="">Choose Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>

            <input
              type="time"
              className="w-full border p-3 mb-4"
              onChange={(e) =>
                setForm({ ...form, timeSlot: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button onClick={() => setStep(1)}>Back</button>
              <button
                onClick={() => {
                  if (!form.date || !form.doctorId || !form.timeSlot)
                    return alert("Fill all fields");
                  setStep(3);
                }}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* step 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Confirm Appointment</h2>

            <p><b>Date:</b> {form.date}</p>
            <p><b>Time:</b> {form.timeSlot}</p>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(2)}>Back</button>
              <button
                onClick={bookAppointment}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                {loading ? "Booking..." : "Confirm"}
              </button>
            </div>
          </>
        )}

        {/* step 4 */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Appointment Booked Successfully 🎉
            </h2>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentComponent;
