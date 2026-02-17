import doctrotintro from "../../assets/doctor/doctorintro.png";

// About section shown on landing page
const AboutSectionComponent = () => {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* Image section */}
        <div className="flex justify-center relative">

          {/* soft background circle */}
          <div className="absolute w-80 h-80 bg-green-100 
                          rounded-full blur-3xl opacity-30"></div>

          <img
            src={doctrotintro}
            alt="About Hospital"
            className="relative w-[340px] md:w-[420px] drop-shadow-xl"
          />
        </div>

        {/* Text content */}
        <div>

          {/* small heading */}
          <span className="text-sm font-semibold text-green-600 tracking-wide">
            ABOUT OUR HOSPITAL
          </span>

          {/* main heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3 mb-6">
            Trusted Healthcare for a Better Life
          </h2>

          {/* description */}
          <p className="text-gray-600 leading-7 mb-5">
            MEDIX is a modern multi-specialty hospital delivering high-quality
            healthcare with compassion, innovation, and excellence.
          </p>

          <p className="text-gray-600 leading-7 mb-8">
            Our expert doctors, advanced medical equipment, and patient-first
            approach ensure safe, affordable, and reliable treatment for every individual.
          </p>

          {/* stats section */}
          <div className="grid grid-cols-2 gap-6">

            <div className="bg-green-50 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-green-600">10+</p>
              <p className="text-gray-600 mt-2 text-sm">
                Years Experience
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-green-600">50+</p>
              <p className="text-gray-600 mt-2 text-sm">
                Expert Doctors
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-green-600">24/7</p>
              <p className="text-gray-600 mt-2 text-sm">
                Emergency Care
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-green-600">1L+</p>
              <p className="text-gray-600 mt-2 text-sm">
                Happy Patients
              </p>
            </div>

          </div>

          {/* button */}
          <button className="mt-10 bg-green-600 text-white px-8 py-3 
                             rounded-lg font-medium hover:bg-green-700 
                             transition shadow-md">
            Discover More
          </button>

        </div>

      </div>
    </section>
  );
};

export default AboutSectionComponent;
