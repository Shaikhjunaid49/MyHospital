// Reset password page
const ResetPasswordComponent = () => {
  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">

        <h2 className="text-xl font-semibold mb-3">
          Reset Password
        </h2>

        <input
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="New Password"
        />

        <input
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="Confirm Password"
        />

        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          Change Password
        </button>

      </div>
    </div>
  );
};

export default ResetPasswordComponent;
