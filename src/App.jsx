import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Pages - Sprint 1 Active UI Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import Employees from './pages/Employees.jsx';

// Components
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);

  const handleEmailLogin = async (email, password) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const status = user?.app_metadata?.record_status;
    if (status !== 'ACTIVE') {
      await supabase.auth.signOut();
      setAuthError("Your account is inactive. Please contact an Admin to activate your account.");
      return;
    }
    navigate('/employees');
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleEmailRegister = async (firstName, lastName, username, email, password) => {
    setAuthError(null);
    setAuthSuccess(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, user_name: username }
      }
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess("Account created! Please wait for an Admin to activate your account.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={
        <LoginPage
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
          authError={authError}
        />
      } />
      <Route path="/register" element={
        <RegisterPage
          onEmailRegister={handleEmailRegister}
          onGoogleRegister={handleGoogleLogin}
          authError={authError}
          authSuccess={authSuccess}
        />
      } />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell onLogout={handleLogout} />}>
          {/* Default root path redirects straight to Employees page */}
          <Route path="/" element={<Navigate to="/employees" replace />} />
          
          {/* Active Sprint 1 Core View */}
          <Route path="/employees" element={<Employees />} />
          
          {/* Sprint 1 Placeholder Route fallbacks to avoid crashes */}
          <Route path="/jobhistory" element={<div>Job History — Coming in Sprint 2</div>} />
          <Route path="/jobs" element={<div>Jobs catalogue — Coming in Sprint 2</div>} />
          <Route path="/departments" element={<div>Departments — Coming in Sprint 2</div>} />
          <Route path="/deleted-items" element={<div>Deleted Items — Coming in Sprint 2</div>} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;