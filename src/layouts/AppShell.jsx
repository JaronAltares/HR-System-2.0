import { useState } from "react";

import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
} from "react-icons/hi";

function AppShell() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // Temporary logged-in user
  const user = {
    name: "HR User",
  };

  // HR Navigation Links
  const navLinks = [
    "Employees",
    "Job History",
    "Jobs",
    "Departments",
    "Admin",
    "Deleted Items",
  ];

  const handleLogout = () => {
    console.log("Logout");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-64 min-h-screen bg-primary text-white p-5 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile Close */}
        <div className="flex justify-end md:hidden mb-4">
          <button
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <HiOutlineX size={26} />
          </button>
        </div>

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            HopeHRS
          </h1>

          <p className="text-sm text-gray-300 mt-1">
            HR Management System
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3">
          {navLinks.map((link, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-secondary transition-all duration-300"
            >
              {link}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <header className="bg-white shadow-md px-5 py-4 flex items-center justify-between">

          {/* Mobile Menu */}
          <button
            className="md:hidden"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <HiOutlineMenu
              size={26}
              className="text-primary"
            />
          </button>

          {/* Title */}
          <h2 className="text-lg font-bold text-primary">
            HR Management System
          </h2>

          {/* User Info */}
          <div className="flex items-center gap-4">

            <span className="text-sm text-gray-600 font-medium">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-all"
            >
              <HiOutlineLogout />

              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-primary">
              Welcome to HopeHRS
            </h1>

            <p className="text-gray-500 mt-2">
              App Shell Layout UI
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}

export default AppShell;