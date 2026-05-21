// src/App.jsx
// M4 — PR-01: feat/rights-admin-module
// Wires email signIn, signUp, Google OAuth, UserRightsProvider, and strict Admin Route Guarding.
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './contexts/UserRightsContext';
import { useRights } from './contexts/UserRightsContext';
import { useCurrentUser } from './hooks/useCurrentUser';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import Admin from './pages/Admin';
import DeletedItems from './pages/DeletedItems';

// Components
import AppShell from './components/AppShell';
import ProtectedRoute from './routes/ProtectedRoutes';

function AdminRouteGuard({ children }) {
  const { rights, loading } = useRights();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <p className="text-sm font-medium tracking-wide animate-pulse">Verifying security clearances...</p>
      </div>
    );
  }

  if (rights?.ADM_USER !== 1) {
    return <Navigate to="/employees" replace />;
  }

  return children;
}

function AppWithShell() {
  const currentUser = useCurrentUser();
  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <p className="text-sm font-medium tracking-wide animate-pulse">Initializing user profile...</p>
      </div>
    );
  }

  return (
    <AppShell
      user={{
        name: currentUser?.name ?? currentUser?.username ?? "User",
        role: currentUser?.user_type ?? "Employee",
        email: currentUser?.email ?? "",
      }}
      onLogout={handleLogout}
    />
  );
}

// 🔄 FIXED: Created a distinct layout context component wrapped inside the Router tree context.
// This allows the children to safely access `useNavigate` and trigger routing redirects after login.
function AppRoutes({ authError, setAuthError, authSuccess, setAuthSuccess, handleGoogleLogin }) {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  // 🛡️ AUTH WATCHER: If `useCurrentUser` loads a profile, programmatically 
  // push the user directly past the login screen into the system dashboard.
  useEffect(() => {
    if (currentUser) {
      navigate('/employees', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleEmailLogin = async (email, password) => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { 
      setAuthError(error.message); 
      return; 
    }
    
    // Programmatically navigate to default entry view
    navigate('/employees');
  };

  const handleEmailRegister = async (firstName, lastName, username, email, password) => {
    setAuthError('');
    setAuthSuccess('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName, lastName, username } },
    });

    if (error) { 
      setAuthError(error.message); 
      return; 
    }

    if (data?.user) {
      setAuthSuccess('Account created! Please wait for an HR Administrator to activate your account before signing in.');
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <LoginPage onEmailLogin={handleEmailLogin} onGoogleLogin={handleGoogleLogin} authError={authError} />
      } />
      <Route path="/register" element={
        <RegisterPage onEmailRegister={handleEmailRegister} onGoogleRegister={handleGoogleLogin} authError={authError} authSuccess={authSuccess} />
      } />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Guarded Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppWithShell />}>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/departments" element={<Departments />} />
          
          <Route path="/admin" element={
            <AdminRouteGuard>
              <Admin />
            </AdminRouteGuard>
          } />
          
          <Route path="/deleted-items" element={<DeletedItems />} />
        </Route>
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const [authError, setAuthError]     = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleGoogleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
    if (error) setAuthError(error.message);
  };

  return (
    <AuthProvider>
      <UserRightsProvider>
        <Router>
          <AppRoutes 
            authError={authError}
            setAuthError={setAuthError}
            authSuccess={authSuccess}
            setAuthSuccess={setAuthSuccess}
            handleGoogleLogin={handleGoogleLogin}
          />
        </Router>
      </UserRightsProvider>
    </AuthProvider>
  );
}

export default App;