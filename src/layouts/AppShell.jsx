import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
} from "react-icons/hi";

function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // TEMP user (M1 will replace with context later)
  const user = {
    name: "HR User",
    role: "ADMIN",
  };

  const handleLogout = () => {
    console.log("Logout clicked");

    // Later: Supabase signOut
    navigate("/");
  };

  const menuItems = [
    { name: "Employees", path: "/employees" },
    { name: "Job History", path: "/jobhistory" },
    { name: "Jobs", path: "/jobs" },
    { name: "Departments", path: "/departments" },
    { name: "Admin", path: "/admin" },
    { name: "Deleted Items", path: "/deleted-items" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div
        className={`fixed md:static z-50 w-64 bg-primary text-white min-h-screen p-5 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close button (mobile) */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)}>
            <HiOutlineX size={24} />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          HopeHRS
        </h1>

        <nav className="space-y-3">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="block px-3 py-2 rounded-lg hover:bg-secondary transition"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="flex items-center justify-between bg-white shadow px-5 py-4">

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <HiOutlineMenu size={24} />
          </button>

          <h2 className="font-bold text-primary">
            HR Management System
          </h2>

          {/* USER INFO */}
          <div className="flex items-center gap-4">

            <div className="text-sm text-gray-600">
              {user.name}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-700"
            >
              <HiOutlineLogout />
              Logout
            </button>

          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="p-5">
          {children}
        </main>

      </div>
    </div>
  );
}

export default AppShell;