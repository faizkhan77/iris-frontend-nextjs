import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const auth = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  console.log(auth);

  return token ? (
    <>{children}</> // render the wrapped component(s)
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
