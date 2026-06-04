import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppProviders } from "./AppProviders";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import BookingsPage from "@/pages/admin/Bookings";
import AdminRooms from "@/pages/admin/Rooms";
import AdminGuests from "@/pages/admin/Guests";
import AdminSettings from "@/pages/admin/Settings";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

const AdminRoutes = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          user && isAdmin ? (
            <Navigate to="/" replace />
          ) : (
            <Auth adminPortal />
          )
        }
      />
      <Route
        path="/"
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

const AdminApp = () => (
  <AppProviders>
    <AdminRoutes />
  </AppProviders>
);

export default AdminApp;
