import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/user/home.page";
import AdminHome from "../pages/admin/home.page";
import Login from "../pages/admin/login.page";
import EventDetailPage from "../pages/user/event.page";
import ProtectedRoute from "../middlewares/ProtectedRoute.middleware";
import PublicRoute from "../middlewares/PublicRoute.middleware";

export const router = createBrowserRouter([
    {
        path: "/event/:id",
        element: (
            <PublicRoute>
                <EventDetailPage />
            </PublicRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/",
        element: (
            <PublicRoute>
                <Home />
            </PublicRoute>
        ),
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminHome />
            </ProtectedRoute>
        ),
    },
]);