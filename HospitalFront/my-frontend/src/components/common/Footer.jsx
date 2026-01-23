import { FaLinkedin, FaGithub, FaFacebook, FaInstagram } from "react-icons/fa";

// Website footer
export default function Footer() {
  return (
    <footer className="bg-green-50 border-t-4 border-transparent bg-gradient-to-r from-green-300 via-green-500 to-green-300">

      {/* Decorative divider */}
      <div className="flex justify-center pt-6">
        <div className="w-24 h-1 bg-green-500 rounded-full"></div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* Brand info */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">MEDIX</h2>
          <p className="text-gray-600 mt-3 text-sm">
            Providing exceptional medical care and modern healthcare solutions.
          </p>
        </div>

        {/* Contact details */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-600">Shaikh Junaid</p>
          <p className="text-sm text-gray-600 mt-1">
            Email: junaidsk4901@gmail.com
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Phone: 9588400344
          </p>
        </div>

        {/* Navigation links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-green-600 transition">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-green-600 transition">About</a>
            </li>
            <li>
              <a href="/services" className="hover:text-green-600 transition">Services</a>
            </li>
            <li>
              <a href="/appointment" className="hover:text-green-600 transition">
                Appointment
              </a>
            </li>
          </ul>
        </div>

        {/* Social links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Me</h3>
          <div className="flex gap-4 text-xl text-green-700">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-green-500 transition">
              <FaLinkedin />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-green-500 transition">
              <FaGithub />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-green-500 transition">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-green-500 transition">
              <FaInstagram />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="bg-green-100 py-3 text-center text-sm text-gray-700">
        © {new Date().getFullYear()} Shaikh Junaid — All Rights Reserved
      </div>
    </footer>
  );
}
