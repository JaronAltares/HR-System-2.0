import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import DeletedItems from './pages/DeletedItems';

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
          <Route path="/employees" element={<Employees />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/deleted-items" element={<DeletedItems />} />
        </Route>
      </Route>

      {/* 404 */}
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