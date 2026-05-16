import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AppShell from './components/AppShell'
import ProtectedRoute from './routes/ProtectedRoute'

const placeholderUser = { username: 'testuser' }

function ShellPage({ children }) {
  return (
    <ProtectedRoute>
      <AppShell currentUser={placeholderUser}>
        {children}
      </AppShell>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes inside App Shell */}
        <Route path="/employees"    element={<ShellPage><div>Employees Page</div></ShellPage>} />
        <Route path="/jobhistory"   element={<ShellPage><div>Job History Page</div></ShellPage>} />
        <Route path="/jobs"         element={<ShellPage><div>Jobs Page</div></ShellPage>} />
        <Route path="/departments"  element={<ShellPage><div>Departments Page</div></ShellPage>} />
        <Route path="/admin"        element={<ShellPage><div>Admin Page</div></ShellPage>} />
        <Route path="/deleted-items" element={<ShellPage><div>Deleted Items Page</div></ShellPage>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App