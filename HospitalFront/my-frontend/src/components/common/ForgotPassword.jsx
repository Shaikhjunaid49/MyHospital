// Forgot password page
const ForgotPasswordComponent = () => {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">

        <h2 className="text-xl font-semibold mb-3">
          Forgot Password
        </h2>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Enter your email"
        />

        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          Send Reset Link
        </button>

      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
