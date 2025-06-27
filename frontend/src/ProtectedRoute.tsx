import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";


const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
