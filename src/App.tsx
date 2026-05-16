import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';     // Comment out for now
// import AppShell from './components/AppShell';       // Comment out for now

// Temporary ProtectedRoute (we'll fix path later)
import ProtectedRoute from './routes/ProtectedRoutes';   // Try this name first

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Home Page (Protected)</div>} />
          <Route path="/employees" element={<div>Employees Page</div>} />
          <Route path="/jobhistory" element={<div>Job History Page</div>} />
          <Route path="/jobs" element={<div>Jobs Page</div>} />
          <Route path="/departments" element={<div>Departments Page</div>} />
          <Route path="/deleted-items" element={<div>Deleted Items Page</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;