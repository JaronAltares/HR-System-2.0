// src/App.jsx
// FIXES:
// 1. AppInner pattern — useNavigate() must be inside <Router>, so logic lives in AppInner
// 2. navigate('/employees') after successful email login
// 3. handleEmailLogin checks record_status before navigating — shows error for INACTIVE users
// 4. All HR routes present: /jobhistory, /jobs, /departments, /admin, /deleted-items
// 5. onLogout passed to AppShell

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from './lib/supabase';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
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

function AppInner() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // FIX: check record_status BEFORE navigating so INACTIVE users see an error
  // instead of being silently bounced back to the login page with no message
  const handleEmailLogin = async (email, password) => {
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }

    // Guard: verify the account is active
    const { data: userRow } = await supabase
      .from('user')
      .select('record_status')
      .eq('userId', data.user.id)
      .single();

    if (!userRow || userRow.record_status !== 'ACTIVE') {
      await supabase.auth.signOut();
      setAuthError('Your account is pending activation by an HR Administrator.');
      return;
    }

    navigate('/employees');
  };

  const handleEmailRegister = async (firstName, lastName, username, email, password) => {
    setAuthError('');
    setAuthSuccess('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, username },
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data.user) {
      setAuthSuccess('Account created! Please wait for an HR Administrator to activate your account before signing in.');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={<LoginPage onEmailLogin={handleEmailLogin} onGoogleLogin={handleGoogleLogin} authError={authError} />}
      />
      <Route
        path="/register"
        element={<RegisterPage onEmailRegister={handleEmailRegister} onGoogleRegister={handleGoogleLogin} authError={authError} authSuccess={authSuccess} />}
      />

      {/* OAuth Callback */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell onLogout={handleLogout} />}>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/deleted-items" element={<DeletedItems />} />
        </Route>
      </Route>

      {/* Catch-All */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}

export default App;