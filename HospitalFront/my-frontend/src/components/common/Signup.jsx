
import { useState } from "react";
import { User, Stethoscope } from "lucide-react";

// Signup component with OTP verification (User / Doctor)
const SignupComponent = () => {
  const [role, setRole] = useState("user");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    otp: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1: Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload =
      role === "doctor"
        ? {
            name: form.name,
            email: form.email,
            role,
            specialization: form.specialization,
            experience: form.experience,
          }
        : {
            name: form.name,
            email: form.email,
            role,
          };

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/signup/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();
      setStep(2);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/signup/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp,
          }),
        }
      );

      if (!res.ok) throw new Error();
      setStep(3);
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Set password
  const setPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/signup/set-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      if (!res.ok) throw new Error();
      alert("Signup successful! Please login.");
    } catch {
      alert("Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">

        {/* Step indicator */}
        <div className="flex justify-between mb-6 text-sm font-medium">
          <span className={step >= 1 ? "text-green-600" : "text-gray-400"}>
            Details
          </span>
          <span className={step >= 2 ? "text-green-600" : "text-gray-400"}>
            OTP
          </span>
          <span className={step >= 3 ? "text-green-600" : "text-gray-400"}>
            Password
          </span>
        </div>

        {/* Role selection */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              onClick={() => setRole("user")}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center
                ${
                  role === "user"
                    ? "border-green-600 bg-green-50"
                    : "hover:border-gray-400"
                }`}
            >
              <User className="w-8 h-8 text-green-600" />
              <p className="mt-2 font-semibold">User</p>
            </div>

            <div
              onClick={() => setRole("doctor")}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center
                ${
                  role === "doctor"
                    ? "border-green-600 bg-green-50"
                    : "hover:border-gray-400"
                }`}
            >
              <Stethoscope className="w-8 h-8 text-green-600" />
              <p className="mt-2 font-semibold">Doctor</p>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500"
            />

            {role === "doctor" && (
              <>
                <input
                  name="specialization"
                  placeholder="Specialization"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500"
                />

                <input
                  name="experience"
                  type="number"
                  placeholder="Experience (years)"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500"
                />
              </>
            )}

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              name="otp"
              placeholder="Enter OTP"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 text-center tracking-widest rounded-xl border focus:ring-2 focus:ring-green-500"
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={setPassword} className="space-y-4">
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500"
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Complete Signup"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupComponent;