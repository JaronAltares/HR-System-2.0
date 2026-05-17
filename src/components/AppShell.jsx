// src/components/AppShell.jsx
// M2 – PR-03: feat/ui-app-shell
// Layout wrapper for all protected pages.
// Composes Sidebar + Navbar + scrollable content area.
//
// Props (wired by M4):
//   user      → { name: string, email: string, role: string }
//   onLogout  → async function — Supabase signOut()
//   children  → page content rendered in the main area

import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// ─── Route → Page Title Map ────────────────────────────────────────────────────
const PAGE_TITLES = {
  "/employees":    "Employees",
  "/jobhistory":   "Job History",
  "/jobs":         "Jobs",
  "/departments":  "Departments",
  "/admin":        "Admin Panel",
  "/deleted-items":"Deleted Items",
};

// ─── AppShell Component ────────────────────────────────────────────────────────
export default function AppShell({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location  = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? "";

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F9FAFB" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main Column ──────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Navbar */}
        <Navbar
          user={user}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}