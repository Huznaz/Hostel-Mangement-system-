import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppProviders } from "./AppProviders";

import Index from "@/pages/Index";
import Rooms from "@/pages/Rooms";
import RoomDetails from "@/pages/RoomDetails";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import BookingsPage from "@/pages/admin/Bookings";
import AdminRooms from "@/pages/admin/Rooms";
import AdminGuests from "@/pages/admin/Guests";
import AdminSettings from "@/pages/admin/Settings";

const FullRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <Auth />}
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="guests" element={<AdminGuests />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const FullApp = () => (
  <AppProviders>
    <FullRoutes />
  </AppProviders>
);

export default FullApp;
