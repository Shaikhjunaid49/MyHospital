import { Link } from "react-router-dom";
import mainHero from "../../assets/doctor/mainHero.png";

// Hero section of landing page
export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-r from-green-50 to-white py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Text content */}
        <div>

          {/* small top label */}
          <p className="text-green-600 font-semibold mb-3">
            24/7 Medical Services
          </p>

          {/* main heading */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800">
            Your Health Is Our <br />
            <span className="text-green-600">First Priority</span>
          </h1>

          {/* description */}
          <p className="mt-5 text-gray-600 text-lg leading-7">
            Professional doctors, modern facilities, and patient-centered
            treatment for you and your family. We provide trusted and
            affordable healthcare solutions.
          </p>

          {/* buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/appointment">
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg 
                                 font-semibold hover:bg-green-700 transition shadow-md">
                Book Appointment
              </button>
            </Link>

            <Link to="/services">
              <button className="px-8 py-3 border border-green-600 
                                 text-green-600 rounded-lg font-semibold 
                                 hover:bg-green-50 transition">
                Explore Services
              </button>
            </Link>
          </div>

          {/* trust badges */}
          <div className="mt-10 flex gap-8 text-sm text-gray-600">
            <div>
              <p className="font-bold text-green-600 text-lg">10+</p>
              Years Experience
            </div>

            <div>
              <p className="font-bold text-green-600 text-lg">50+</p>
              Doctors
            </div>

            <div>
              <p className="font-bold text-green-600 text-lg">24/7</p>
              Support
            </div>
          </div>

        </div>

        {/* Hero image */}
        <div className="flex justify-center relative">

          {/* background glow */}
          <div className="absolute w-72 h-72 bg-green-100 
                          rounded-full blur-3xl opacity-40"></div>

          <img
            src={mainHero}
            alt="Medical Illustration"
            className="relative w-full max-w-md object-contain drop-shadow-xl"
          />
        </div>

      </div>
    </section>
  );
}
