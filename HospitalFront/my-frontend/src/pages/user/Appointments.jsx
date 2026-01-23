import { useEffect, useState } from "react";
import { getAppointments, cancelAppointment } from "../../api/appointments";


export default function UserAppointments() {
    const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async()=>{
    const {data} =await getAppointments();
    setAppointments(data.appointments);
  };

  const handleCancel = async (id) => {
    await cancelAppointment(id);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Appointments</h2>

      {appointments.map((a) => (
        <div key={a._id} className="border p-4 mb-3 rounded shadow">
          <p><b>Service:</b> {a.service?.name}</p>
          <p><b>Date:</b> {a.date}</p>
          <p><b>Status:</b> {a.status}</p>

          {a.status === "pending" && (
            <button
              onClick={() => handleCancel(a._id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}