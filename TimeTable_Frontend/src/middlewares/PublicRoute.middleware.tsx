import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
}