import { Link, useLocation } from 'react-router-dom';
import { LogOut, Users, Briefcase, Building, History, Trash2, UserCog } from 'lucide-react';

function AppShell({ children }) {
  const location = useLocation();

  const menuItems = [
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/jobhistory', label: 'Job History', icon: History },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/departments', label: 'Departments', icon: Building },
    { path: '/deleted-items', label: 'Deleted Items', icon: Trash2 },
    { path: '/admin', label: 'Admin', icon: UserCog },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-purple-600">HopeHRS</h1>
          <p className="text-sm text-gray-500">Human Resource System</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <div className="font-medium text-gray-700">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div className="font-medium">Jaron Altares</div>
              <div className="text-gray-500 text-xs">HR Staff</div>
            </div>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
              JA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;