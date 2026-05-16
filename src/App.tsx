import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Pages (we'll create them later)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <div>Welcome to Hope HR System</div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/employees" 
          element={
            <ProtectedRoute>
              <div>Employees Page (Coming Soon)</div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/jobhistory" 
          element={
            <ProtectedRoute>
              <div>Job History Page (Coming Soon)</div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/jobs" 
          element={
            <ProtectedRoute>
              <div>Jobs Page (Coming Soon)</div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/departments" 
          element={
            <ProtectedRoute>
              <div>Departments Page (Coming Soon)</div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/deleted-items" 
          element={
            <ProtectedRoute>
              <div>Deleted Items Page (Admin Only)</div>
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;