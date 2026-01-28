import doctrotintro from "../../assets/doctor/doctorintro.png";

// About section shown on landing page
const AboutSectionComponent = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#f3f6f4] to-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* Image section */}
        <div className="flex justify-center relative">
          <div className="absolute -inset-4 bg-green-100 rounded-full blur-3xl opacity-40"></div>

          <img
            src={doctrotintro}
            alt="About Medix"
            className="relative w-[320px] md:w-[400px] drop-shadow-xl"
          />
        </div>

        {/* Text content */}
        <div>
          <span className="inline-block text-sm font-semibold text-green-600 mb-2">
            ABOUT OUR HOSPITAL
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">
            Trusted Healthcare for a Better Life
          </h2>

          <p className="text-gray-600 leading-7 mb-4">
            MEDIX is a modern multi-specialty hospital delivering high-quality
            healthcare with compassion, innovation, and excellence.
          </p>

          <p className="text-gray-600 leading-7 mb-6">
            Our expert doctors, advanced medical equipment, and patient-first
            approach ensure safe and reliable treatment for every individual.
          </p>

          {/* highlights */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">10+</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">50+</p>
              <p className="text-sm text-gray-600">Expert Doctors</p>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">24/7</p>
              <p className="text-sm text-gray-600">Emergency Care</p>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">1L+</p>
              <p className="text-sm text-gray-600">Happy Patients</p>
            </div>
          </div>

          {/* action button */}
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition shadow-md">
            Discover More
          </button>
        </div>

      </div>
    </section>
  );
};

export default AboutSectionComponent;
