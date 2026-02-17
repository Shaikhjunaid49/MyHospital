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
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/appointments", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    const auth = JSON.parse(localStorage.getItem("auth"));

    await API.delete(`/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    fetchAppointments();
  };

  const upcoming = appointments.filter(
    (a) => new Date(a.start) > new Date()
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-green-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-10">Hospital Panel</h2>
        <ul className="space-y-4">
          <li className="cursor-pointer">Dashboard</li>
          <li className="cursor-pointer">Appointments</li>
          <li className="cursor-pointer">Profile</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Dashboard</h1>

          <button
            onClick={() => navigate("/appointment")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow"
          >
            Book Appointment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Total Appointments</p>
            <h2 className="text-3xl font-bold">{appointments.length}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Upcoming</p>
            <h2 className="text-3xl font-bold">{upcoming}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-3xl font-bold">{completed}</h2>
          </div>
        </div>

        {/* Appointment List */}
        {loading && <p>Loading...</p>}

        <div className="space-y-5">
          {appointments.map((a) => {
            const isExpired = new Date(a.end) < new Date();

            return (
              <div
                key={a._id}
                className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {new Date(a.start).toLocaleString()}
                  </p>
                  <p className="text-gray-500">
                    Doctor: {a.doctorId?.name}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <span className="capitalize font-semibold">
                    {a.status}
                  </span>

                  {a.status === "confirmed" && !isExpired && (
                    <button
                      onClick={() => navigate(`/room/${a._id}`)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                    >
                      Join
                    </button>
                  )}

                  {["canceled", "completed"].includes(a.status) && (
                    <button
                      onClick={() => deleteAppointment(a._id)}
                      className="bg-gray-200 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardComponent;
