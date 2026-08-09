import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
