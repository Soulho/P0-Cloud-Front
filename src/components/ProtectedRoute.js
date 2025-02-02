import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    return token && token !== "undefined" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;