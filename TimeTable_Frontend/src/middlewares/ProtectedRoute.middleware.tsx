import { Navigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useAppDispatch } from "../hooks/redux";
import { setAuth } from "../stores/slices/authSlices";
import { AuthorizeAPI } from "../services/apis/auth.service";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await AuthorizeAPI()
                setAuthorized(res.data.data.authorized)
                dispatch(
                    setAuth({
                        authorized: res.data.data.authorized,
                        firstname: res.data.data.userFirstname
                    })
                )
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [dispatch]);

    if (loading) return (
        <Box>
        </Box >
    )
    if (!authorized) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}