import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // If no user, kick them to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;