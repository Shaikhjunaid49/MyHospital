// Admin dashboard main page
// Shows high-level admin controls and summary

const AdminDashboardComponent = () => {
  return (
    <div className="min-h-screen bg-green-50 p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Short description of admin responsibilities */}
      <p className="mt-3 text-gray-700">
        Manage users, doctors, bookings, payments…
      </p>
    </div>
  );
};

export default AdminDashboardComponent;
