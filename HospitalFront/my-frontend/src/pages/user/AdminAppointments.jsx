import { useEffect, useState } from "react";
import { getAdminAppointments } from "../../api/admin";

export default function AdminAppointments() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await getAdminAppointments();
    setList(data.appointments);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Appointments</h2>

      {list.map((a) => (
        <div key={a._id} className="border p-4 mb-3 shadow rounded">
          <p><b>User:</b> {a.user?.name}</p>
          <p><b>Service:</b> {a.service?.name}</p>
          <p><b>Date:</b> {a.date}</p>
          <p><b>Status:</b> {a.status}</p>
        </div>
      ))}
    </div>
  );
}
