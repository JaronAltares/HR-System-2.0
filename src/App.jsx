// src/App.jsx
// M4 — feat/auth-email-signup + feat/auth-google-oauth
// Wires email signIn, signUp, and Google OAuth to Login/Register pages

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Components
import AppShell from './components/AppShell';
import ProtectedRoute from './routes/ProtectedRoutes';

function App() {
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleEmailLogin = async (email, password) => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
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

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <LoginPage
                onEmailLogin={handleEmailLogin}
                onGoogleLogin={handleGoogleLogin}
                authError={authError}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterPage
                onEmailRegister={handleEmailRegister}
                onGoogleRegister={handleGoogleLogin}
                authError={authError}
                authSuccess={authSuccess}
              />
            }
          />

          {/* OAuth Callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/employees" replace />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/jobhistory" element={<JobHistory />} />
              <Route path="/jobs" element={<div className="p-8 text-gray-500">Jobs — Coming in Sprint 2</div>} />
              <Route path="/departments" element={<div className="p-8 text-gray-500">Departments — Coming in Sprint 2</div>} />
              <Route path="/admin" element={<div className="p-8 text-gray-500">Admin — Coming in Sprint 2</div>} />
              <Route path="/deleted-items" element={<div className="p-8 text-gray-500">Deleted Items — Coming in Sprint 2</div>} />
            </Route>
          </Route>

          {/* Catch-All */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;