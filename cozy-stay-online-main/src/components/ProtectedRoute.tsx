import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isAdminApp } from "@/config/appMode";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    if (isAdminApp) {
      return <Navigate to="/auth" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
