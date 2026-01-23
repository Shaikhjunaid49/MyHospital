import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../../api/services";

// Services page (backend data)
export default function Services() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await getServices();
      setServices(data.services || []);
    } catch (err) {
      console.error("Failed to load services", err);
    }
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Available Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s._id}
              className="bg-white shadow border rounded-xl p-5"
            >
              <h3 className="font-semibold text-lg">
                {s.name}
              </h3>

              <p className="text-gray-600 text-sm mt-2">
                {s.description}
              </p>

              <p className="font-bold mt-3">
                ₹ {s.price}
              </p>

              <button
                onClick={() =>
                  navigate(`/appointment?serviceId=${s._id}`)
                }
                className="mt-4 w-full bg-green-600 text-white py-2 rounded"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
