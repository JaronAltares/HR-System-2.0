import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';   // Uncomment when ready

// Components
import ProtectedRoute from './components/ProtectedRoute';   // Make sure path is correct

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Welcome to Hope HR System</div>} />
          
          <Route path="/employees" element={<div>Employees Page (Coming Soon)</div>} />
          <Route path="/jobhistory" element={<div>Job History Page (Coming Soon)</div>} />
          <Route path="/jobs" element={<div>Jobs Page (Coming Soon)</div>} />
          <Route path="/departments" element={<div>Departments Page (Coming Soon)</div>} />
          <Route path="/deleted-items" element={<div>Deleted Items Page (Admin Only)</div>} />
        </Route>

        {/* Catch all / 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;