import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Unauthorized from "./pages/auth/Unauthorized";

import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/user/Home";
import Services from "./pages/user/Services";
import About from "./pages/user/About";
import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/user/Profile";
import DoctorDashboard from "./pages/user/DoctorDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";

import Appointment from "./pages/meeting/Appointment";
import Payment from "./pages/meeting/Payment";
import VideoCall from "./pages/meeting/VideoCall";
import Room from "./pages/meeting/Room";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Services now protected for logged-in user */}
        <Route
          path="/services"
          element={
            <ProtectedRoute role="user">
              <Services />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* User dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* General logged-in routes */}
        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room/:id"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
