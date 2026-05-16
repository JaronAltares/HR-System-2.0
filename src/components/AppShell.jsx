import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Employees',    path: '/employees' },
  { label: 'Job History',  path: '/jobhistory' },
  { label: 'Jobs',         path: '/jobs' },
  { label: 'Departments',  path: '/departments' },
  { label: 'Admin',        path: '/admin' },
  { label: 'Deleted Items',path: '/deleted-items' },
]

function AppShell({ children, currentUser }) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function handleLogout() {
    // Supabase signOut will be wired here by M4
    console.log('Logout triggered')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-brand-navy text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-bold tracking-wide">Hope, Inc. HR System</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {currentUser?.username ?? 'User'}
          </span>
          <button
            onClick={handleLogout}
            className="bg-brand-teal text-white text-sm px-4 py-1.5 rounded-lg hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebarOpen && (          <aside className="w-56 bg-brand-navy text-white flex flex-col py-6 px-3 gap-1 shadow-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>                  `rounded-lg px-4 py-2 text-sm font-medium transition ${                    isActive                      ? 'bg-brand-teal text-white'                      : 'text-gray-300 hover:bg-white/10'                  }`                }
              >
                {link.label}
              </NavLink>
            ))}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell