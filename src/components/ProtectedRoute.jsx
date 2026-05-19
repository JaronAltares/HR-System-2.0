import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Get user role from database
      const { data: userData } = await supabase
        .from('user')
        .select('user_type, record_status')
        .eq('id', session.user.id)
        .single();

      setUser({
        ...session.user,
        user_type: userData?.user_type || 'USER',
        record_status: userData?.record_status
      });
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.record_status !== 'ACTIVE') {
    return <Navigate to="/login" replace />;
  }

  // Block USER from accessing Deleted Items
  const currentPath = window.location.pathname;
  if (currentPath === '/deleted-items' && user.user_type === 'USER') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;