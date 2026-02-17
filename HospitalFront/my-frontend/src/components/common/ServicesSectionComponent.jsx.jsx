import { 
  FaTooth, 
  FaHeartbeat, 
  FaBrain, 
  FaXRay,
  FaUserMd,
  FaEye,
  FaLungs,
  FaStethoscope
} from "react-icons/fa";

// Homepage services showcase
const ServicesSectionComponent = () => {
  return (
    <section id="services" className="py-20 bg-[#f9fdf9] px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Browse Medical Services
          </h2>
          <p className="text-gray-600 mt-3">
            Choose from our wide range of hospital specialties
          </p>
        </div>

        {/* service categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <ServiceCard icon={<FaUserMd />} title="General Physician" />
          <ServiceCard icon={<FaHeartbeat />} title="Cardiology" />
          <ServiceCard icon={<FaBrain />} title="Neurology" />
          <ServiceCard icon={<FaTooth />} title="Dental Care" />
          <ServiceCard icon={<FaEye />} title="Ophthalmology" />
          <ServiceCard icon={<FaLungs />} title="Pulmonology" />
          <ServiceCard icon={<FaXRay />} title="Radiology" />
          <ServiceCard icon={<FaStethoscope />} title="ENT Specialist" />
        </div>

      </div>
    </section>
  );
};

// single service category card
const ServiceCard = ({ icon, title }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 text-center cursor-pointer">
    
    {/* icon */}
    <div className="w-16 h-16 mx-auto flex items-center justify-center 
                    bg-green-50 text-green-600 rounded-full text-2xl">
      {icon}
    </div>

    {/* title */}
    <h3 className="font-semibold text-sm mt-4">
      {title}
    </h3>
  </div>
);

export default ServicesSectionComponent;
