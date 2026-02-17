import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../../api/services";
import { FaStethoscope } from "react-icons/fa";

// Fetches services from backend
const ServicesListComponent = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  // load services from backend
  const loadServices = async () => {
    try {
      const { data } = await getServices();
      setServices(data.services || []);
    } catch (error) {
      alert("Failed to load services");
    }
  };

  // hospital offers
  const offers = [
    "Free OPD Consultation on Mondays",
    "20% off on Dental Checkup",
    "Free Blood Pressure Test",
    "Eye Checkup Package @ ₹399",
    "Full Body Checkup @ ₹999",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* heading */}
      <h2 className="text-3xl font-bold mb-8">
        Available Services
      </h2>

      {/* services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6"
          >
            {/* top icon */}
            <div className="w-14 h-14 flex items-center justify-center 
                            bg-green-50 text-green-600 rounded-full text-xl">
              <FaStethoscope />
            </div>

            {/* service name */}
            <h3 className="font-semibold text-lg mt-4">
              {s.name}
            </h3>

            {/* description */}
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {s.description}
            </p>

            {/* price */}
            <p className="font-bold text-green-700 mt-4 text-lg">
              ₹ {s.price}
            </p>

            {/* book button */}
            <button
              onClick={() =>
                navigate(`/appointment?serviceId=${s._id}`)
              }
              className="mt-5 w-full bg-green-600 hover:bg-green-700 
                         text-white py-2 rounded-lg transition"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* hospital offers section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6 text-green-700">
          Hospital Offers
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 
                         p-5 rounded-xl shadow-sm"
            >
              {offer}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ServicesListComponent;
