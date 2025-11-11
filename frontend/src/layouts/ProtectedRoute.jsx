import { useContext } from "react";
import { GlobleContext } from "../context/GlobleContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowed }) => {
  const { user, loading } = useContext(GlobleContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
