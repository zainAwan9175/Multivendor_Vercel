import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
 import Loader from "../components/Layout/Loader";
 const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


export default ProtectedRoute;
