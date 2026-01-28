import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  // mobile menu state
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  // get auth and logout from context
  const { auth, logout } = useAuth();

  // logout user
  const handleLogout = () => {
    logout(); // clears localStorage and state
    navigate("/login"); // redirect to login
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 border border-green-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v18M3 12h18"
                  stroke="#16A34A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span className="block text-lg font-semibold text-gray-800">
                MEDIX
              </span>
              <span className="block text-xs text-green-600">
                Care & Wellness
              </span>
            </div>
          </Link>

          {/* desktop menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600">
              About
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-green-600">
              Services
            </Link>

            {/* show only if logged in */}
            {auth?.user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
                Dashboard
              </Link>
            )}
          </nav>

          {/* right buttons */}
          <div className="flex items-center gap-3">
            {!auth?.user ? (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-block text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:inline-block rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/appointment"
                  className="hidden md:inline-block rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Book Appointment
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-block text-sm text-red-600"
                >
                  Logout
                </button>
              </>
            )}

            {/* mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white md:hidden"
            >
              <svg
                className={`h-5 w-5 transition-transform ${open ? "rotate-90" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="#374151"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div className="md:hidden mt-3 rounded-lg border bg-white p-4 shadow space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className="block">
              Home
            </Link>
            <Link to="/about" onClick={() => setOpen(false)} className="block">
              About
            </Link>
            <Link to="/services" onClick={() => setOpen(false)} className="block">
              Services
            </Link>

            {!auth?.user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="block">
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block"
                >
                  Dashboard
                </Link>
                <Link
                  to="/appointment"
                  onClick={() => setOpen(false)}
                  className="block"
                >
                  Book Appointment
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
