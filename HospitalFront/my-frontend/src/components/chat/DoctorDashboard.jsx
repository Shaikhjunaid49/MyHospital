import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// Doctor dashboard
// Shows all appointments assigned to the doctor
const DoctorDashboardComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all doctor appointments from backend
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

  // Load appointments on page load
  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  // Update appointment status (confirm / cancel)
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

  // Delete appointment
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

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Doctor Dashboard
        </h1>

        {loading && <p>Loading...</p>}

        <div className="space-y-4">
          {appointments.map((a) => {
            const isExpired = new Date(a.end) < new Date();

            return (
              <div
                key={a._id}
                className="bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
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
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(a._id, "canceled")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded"
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

export default DoctorDashboardComponent;
