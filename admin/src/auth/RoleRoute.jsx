import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedOffices = [] }) {
  const token = localStorage.getItem("token");
  const adminData = JSON.parse(localStorage.getItem("adminData"));

  if (!token || !adminData) {
    return <Navigate to="/error" replace />;
  }

  // check office permission
  const userOffice = adminData.Office?.toUpperCase();

  if (!allowedOffices.includes(userOffice)) {
    return <Navigate to="/error" replace />;
  }

  return children;
}
