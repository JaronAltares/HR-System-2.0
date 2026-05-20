// src/components/AppShell.jsx
// FIX: AppShell now calls useCurrentUser() internally instead of relying
// on a user prop that App.jsx never passed. This means Navbar always gets
// the real profile (name, user_type) instead of undefined.

import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const PAGE_TITLES = {
  "/employees":    "Employees",
  "/jobhistory":   "Job History",
  "/jobs":         "Jobs",
  "/departments":  "Departments",
  "/admin":        "Admin Panel",
  "/deleted-items":"Deleted Items",
};

export default function AppShell({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location  = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? "";

  // FIX: fetch profile here so Navbar always has name + user_type
  const currentUser = useCurrentUser();

  // FIX: Navbar expects user.role but useCurrentUser returns user_type
  // Map user_type → readable role label
  const navbarUser = currentUser
    ? {
        name: currentUser.name,
        role: currentUser.user_type === "SUPERADMIN"
          ? "Super Admin"
          : currentUser.user_type === "ADMIN"
          ? "HR Manager"
          : "HR Staff",
      }
    : null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F9FAFB" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          user={navbarUser}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}