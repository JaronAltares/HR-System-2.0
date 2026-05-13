import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeListPage from './pages/EmployeeListPage';
// Add more placeholder pages later

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
              <EmployeeListPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/employees" 
          element={
            <ProtectedRoute>
              <EmployeeListPage />
            </ProtectedRoute>
          } 
        />

        {/* Placeholder routes for other modules */}
        <Route path="/jobhistory" element={<div>Job History Page (Coming Soon)</div>} />
        <Route path="/jobs" element={<div>Jobs Page (Coming Soon)</div>} />
        <Route path="/departments" element={<div>Departments Page (Coming Soon)</div>} />
        <Route path="/deleted-items" element={<div>Deleted Items Page (Coming Soon)</div>} />

        {/* Catch all */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;