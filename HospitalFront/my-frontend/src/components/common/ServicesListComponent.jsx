import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../../api/services";

// Fetches services from backend
const ServicesListComponent = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await getServices();
      setServices(data.services || []);
    } catch {
      alert("Failed to load services");
    }
  };

  // random hospital offers
  const offers = [
    "Free OPD Consultation on Mondays",
    "20% off on Dental Checkup",
    "Free Blood Pressure Test",
    "Eye Checkup Package @ ₹399",
    "Full Body Checkup @ ₹999",
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Available Services
      </h2>

      {/* services list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s._id}
            className="border rounded-xl p-5 shadow bg-white"
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

      {/* hospital offers */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4 text-green-700">
          Hospital Offers
        </h3>

        <ul className="grid md:grid-cols-2 gap-4">
          {offers.map((offer, index) => (
            <li
              key={index}
              className="bg-green-50 border border-green-200 p-4 rounded-lg"
            >
              {offer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServicesListComponent;
