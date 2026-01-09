import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./Context/UserContext";

function ProtectedRoute({ children }) {
    const { user } = useContext(UserContext);

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
