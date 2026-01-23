import { Link } from "react-router-dom";

// Hero section of landing page
export default function Hero() {
  return (
    <section className="w-full bg-green-50 py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Text content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Your Health Is Our <br />
            <span className="text-green-600">First Priority</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Professional doctors, 24/7 support, and advanced medical care.
          </p>

          <Link to="/appointment">
            <button className="mt-6 px-6 py-3 bg-green-400 text-white rounded-lg text-lg font-semibold hover:bg-green-500 transition">
              Book Appointment
            </button>
          </Link>
        </div>

        {/* Hero image */}
        <div className="flex justify-center">
          <img
            src="/src/assets/doctor/mainHero.png"
            alt="Medical Illustration"
            className="w-full max-w-md max-h-[320px] object-contain"
          />
        </div>

      </div>
    </section>
  );
}
