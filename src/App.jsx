import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase'; // ✅ Import the secure client instance

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import Employees from './pages/Employees';

// Components
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  
  // ✅ The actual Google OAuth handshake engine
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Directs the incoming auth token channel exactly to your callback endpoint
          redirectTo: window.location.origin + '/auth/callback',
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('OAuth initialization failed:', err.message);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* ✅ Pass down the auth engine to the UI prop slot */}
        <Route path="/login" element={<LoginPage onGoogleLogin={handleGoogleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* OAuth Handshake Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected System Layout Framework */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {/* Fallback internal route drops straight to your working Employee List */}
            <Route path="/" element={<Navigate to="/employees" replace />} />
            <Route path="/employees" element={<Employees />} />
          </Route>
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;