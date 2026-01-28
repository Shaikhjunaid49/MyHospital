import { FaTooth, FaHeartbeat, FaBrain, FaXRay } from "react-icons/fa";

// Homepage services showcase
const ServicesSectionComponent = () => {
  return (
    <section id="services" className="py-20 bg-[#f9fdf9] px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Left text */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our Services
          </h2>

          <p className="text-gray-600 mt-3">
            We provide high-quality and advanced medical services.
          </p>

          <img
            src="/assets/doctor/doctor1.png"
            alt="Doctor"
            className="mt-10 w-80 md:w-96"
          />
        </div>

        {/* Right cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ServiceCard icon={<FaXRay />} title="X-Ray" />
          <ServiceCard icon={<FaHeartbeat />} title="Cardiology" />
          <ServiceCard icon={<FaBrain />} title="Neurology" />
          <ServiceCard icon={<FaTooth />} title="Dental Care" />
        </div>

      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="text-green-600 text-3xl">{icon}</div>
    <h3 className="font-semibold text-lg mt-3">{title}</h3>
    <p className="text-gray-600 text-sm mt-2">
      Professional medical service with expert doctors.
    </p>
  </div>
);

export default ServicesSectionComponent;
