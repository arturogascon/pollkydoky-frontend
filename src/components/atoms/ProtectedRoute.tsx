import { type JSX } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  onlyGuest,
}: {
  children: JSX.Element;
  onlyGuest?: boolean;
}) => {
  const { isAuthenticated } = useAuth();

  if (onlyGuest && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (!onlyGuest && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
