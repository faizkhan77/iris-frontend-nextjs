import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { token, loading, persist } = useAuth();
  const location = useLocation()

  if (loading && persist) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></span>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
