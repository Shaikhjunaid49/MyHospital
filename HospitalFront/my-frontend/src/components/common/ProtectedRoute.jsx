import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Protects routes based on login & role
export default function ProtectedRoute({ children, role }) {
  const { auth } = useAuth();

  // User not logged in
  if (!auth?.token || !auth?.user) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction
  if (role && auth.user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
