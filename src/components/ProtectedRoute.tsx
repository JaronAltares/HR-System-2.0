import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  requiredRight?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requiredRight 
}: ProtectedRouteProps) {
  
  const { user, userType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special guard for Deleted Items page
  if (location.pathname === '/deleted-items') {
    if (userType !== 'ADMIN' && userType !== 'SUPERADMIN') {
      return <Navigate to="/employees" replace />;
    }
  }

  // If specific roles are required
  if (allowedRoles.length > 0 && !allowedRoles.includes(userType || '')) {
    return <Navigate to="/employees" replace />;
  }

  return <>{children}</>;
}