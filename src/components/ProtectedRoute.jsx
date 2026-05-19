import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsAuthenticated(false);
        return;
      }
      const status = session.user?.app_metadata?.record_status;
      setIsAuthenticated(status === 'ACTIVE');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setIsAuthenticated(false);
          return;
        }
        const status = session.user?.app_metadata?.record_status;
        setIsAuthenticated(status === 'ACTIVE');
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;