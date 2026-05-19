import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function ProtectedRoute({ children }) {
  // For now: Simple check (we'll improve with AuthContext later)
  const user = supabase.auth.getUser(); // This is async, we'll handle it properly soon

  // Temporary: Allow access for development
  // TODO: Replace with real auth check in M4
  const isAuthenticated = true; // Change this later

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;