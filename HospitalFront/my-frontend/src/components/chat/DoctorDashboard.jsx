import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// Doctor dashboard
// Shows all appointments assigned to the doctor
const DoctorDashboardComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDoctorAppointments = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/appointments/doctor", {
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
    fetchDoctorAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    await API.patch(
      `/appointments/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    fetchDoctorAppointments();
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    const auth = JSON.parse(localStorage.getItem("auth"));

    await API.delete(`/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    fetchDoctorAppointments();
  };

  const pending = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  const confirmed = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-10">Doctor Panel</h2>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Appointments</li>
          <li>Profile</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        
        <h1 className="text-3xl font-bold mb-8">
          Doctor Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Total</p>
            <h2 className="text-3xl font-bold">{appointments.length}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold">{pending}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Confirmed</p>
            <h2 className="text-3xl font-bold">{confirmed}</h2>
          </div>
        </div>

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
                    {a.patientId?.name}
                  </p>
                  <p className="text-gray-500">
                    {new Date(a.start).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Service: {a.serviceId?.title}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="capitalize font-semibold">
                    {a.status}
                  </span>

                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(a._id, "confirmed")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(a._id, "canceled")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {a.status === "confirmed" && !isExpired && (
                    <button
                      onClick={() =>
                        navigate(`/room/${a._id}`)
                      }
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                    >
                      Join
                    </button>
                  )}

                  {["canceled", "completed"].includes(a.status) && (
                    <button
                      onClick={() =>
                        deleteAppointment(a._id)
                      }
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

export default DoctorDashboardComponent;
