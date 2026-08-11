import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  const token = localStorage.getItem("token");

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  if (!user && token) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;