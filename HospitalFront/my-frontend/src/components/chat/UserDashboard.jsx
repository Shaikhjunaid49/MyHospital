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
      const res = await API.get("/api/appointments", {
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

    await API.delete(`/api/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-green-50 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">
            User Dashboard
          </h1>

          <button
            onClick={() => navigate("/appointment")}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Book Appointment
          </button>
        </div>

        {loading && <p>Loading...</p>}

        <div className="space-y-4">
          {appointments.map((a) => {
            const isExpired =
              new Date(a.end) < new Date();

            return (
              <div
                key={a._id}
                className="bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {new Date(a.start).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Doctor: {a.doctorId?.name}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="capitalize font-semibold">
                    {a.status}
                  </span>

                  {a.status === "confirmed" &&
                    !isExpired && (
                      <button
                        onClick={() =>
                          navigate(`/room/${a._id}`)
                        }
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                      >
                        Join
                      </button>
                    )}

                  {["canceled", "completed"].includes(
                    a.status
                  ) && (
                    <button
                      onClick={() =>
                        deleteAppointment(a._id)
                      }
                      className="bg-gray-200 px-4 py-2 rounded"
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
