// src/App.jsx
// M4 — feat/auth-email-signup + feat/auth-google-oauth
// Wires email signIn, signUp, and Google OAuth to Login/Register pages
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context/AuthContext';
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

function AppWithShell() {
  const currentUser = useCurrentUser();
  const handleLogout = async () => { await supabase.auth.signOut(); };
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

function App() {
  const [authError, setAuthError]     = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleEmailLogin = async (email, password) => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthError(error.message); return; }
  };

  const handleEmailRegister = async (firstName, lastName, username, email, password) => {
    setAuthError('');
    setAuthSuccess('');
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { firstName, lastName, username } },
    });
    if (error) { setAuthError(error.message); return; }
    if (data.user) {
      setAuthSuccess('Account created! Please wait for an HR Administrator to activate your account before signing in.');
    }
  };

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
      <Router>
        <Routes>
          <Route path="/login" element={
            <LoginPage onEmailLogin={handleEmailLogin} onGoogleLogin={handleGoogleLogin} authError={authError} />
          } />
          <Route path="/register" element={
            <RegisterPage onEmailRegister={handleEmailRegister} onGoogleRegister={handleGoogleLogin} authError={authError} authSuccess={authSuccess} />
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppWithShell />}>
              <Route path="/" element={<Navigate to="/employees" replace />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/jobhistory" element={<JobHistory />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/deleted-items" element={<DeletedItems />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;