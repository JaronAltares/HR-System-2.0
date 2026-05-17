import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import DeletedItems from './pages/DeletedItems';

// Components
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<div>Welcome to Hope HR System</div>} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/jobhistory" element={<JobHistory />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/deleted-items" element={<DeletedItems />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;