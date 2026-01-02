import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("pos_user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
