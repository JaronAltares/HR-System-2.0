// src/components/Sidebar.jsx
// M2 – PR-05: fix/ui-sidebar-gating
// Hides "Admin" and "Deleted Items" nav links for USER accounts.
// Uses:
//   M4 → useCurrentUser()  to read user_type

import { NavLink, useLocation } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

// ─── Nav Items ─────────────────────────────────────────────────────────────────
// `minRole` controls visibility:
//   undefined  → visible to all (USER, ADMIN, SUPERADMIN)
//   "ADMIN"    → visible to ADMIN and SUPERADMIN only
const NAV_ITEMS = [
  {
    label: "Employees",
    path: "/employees",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
             M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
             0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Job History",
    path: "/jobhistory",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16
             6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0
             002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Departments",
    path: "/departments",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2
             0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5
             10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Admin",
    path: "/admin",
    minRole: "ADMIN",                           // ← hidden for USER
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0
             002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0
             001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0
             00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724
             0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724
             1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724
             1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724
             1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608
             2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Deleted Items",
    path: "/deleted-items",
    minRole: "ADMIN",                           // ← hidden for USER
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
             01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
             00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  },
];

// ─── Role Hierarchy Helper ─────────────────────────────────────────────────────
// Returns true if the current user's role meets or exceeds the required minRole.
const ROLE_RANK = { USER: 0, ADMIN: 1, SUPERADMIN: 2 };

function hasMinRole(userType, minRole) {
  if (!minRole) return true;                    // no restriction — always show
  const userRank     = ROLE_RANK[userType]  ?? 0;
  const requiredRank = ROLE_RANK[minRole]   ?? 99;
  return userRank >= requiredRank;
}

// ─── Sidebar Component ─────────────────────────────────────────────────────────
export default function Sidebar({ isOpen, onClose }) {
  const location    = useLocation();
  const currentUser = useCurrentUser();
  const userType    = currentUser?.user_type ?? "USER";

  // Filter nav items the current user is allowed to see
  const visibleItems = NAV_ITEMS.filter(item => hasMinRole(userType, item.minRole));

  return (
    <>
      {/* ── Mobile overlay backdrop ─────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar Panel ──────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-60 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: "#1B263B" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shrink-0"
            style={{ backgroundColor: "#59ABBD", color: "#1B263B" }}
          >
            H
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Hope, Inc.</p>
            <p className="text-xs" style={{ color: "#59ABBD" }}>HR System</p>
          </div>
        </div>

        {/* Nav Section Label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#4A6080" }}>
            Navigation
          </p>
        </div>

        {/* Nav Links — filtered by role */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {visibleItems.map(({ label, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                           text-sm font-medium transition-all duration-150 group"
                style={{
                  backgroundColor: isActive ? "#59ABBD22" : "transparent",
                  color: isActive ? "#59ABBD" : "#9FB3C8",
                  borderLeft: isActive ? "3px solid #59ABBD" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#ffffff0a";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#9FB3C8";
                  }
                }}
              >
                <span className="shrink-0">{icon}</span>
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom version tag */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs" style={{ color: "#4A6080" }}>
            © 2025–2026 Hope, Inc.
          </p>
          <p className="text-xs" style={{ color: "#4A6080" }}>
            New Era University Capstone
          </p>
        </div>
      </aside>
    </>
  );
}