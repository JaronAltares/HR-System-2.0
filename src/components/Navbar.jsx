// src/components/Navbar.jsx
// M2 – PR-03: feat/ui-app-shell
// UI ONLY — onLogout and user object are wired by M4.

// ─── Helper: get initials from full name ──────────────────────────────────────
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Navbar Component ──────────────────────────────────────────────────────────
// Props (wired by M4):
//   user      → { name: string, email: string, role: string }
//   onLogout  → async function — Supabase signOut()
//   onMenuClick → () => void — toggles mobile sidebar
//   pageTitle → string — current page name (optional, derived from route)

export default function Navbar({ user, onLogout, onMenuClick, pageTitle }) {
  const initials  = getInitials(user?.name);
  const role      = user?.role ?? "Employee";
  const name      = user?.name ?? "User";

  async function handleLogout() {
    if (onLogout) await onLogout();
  }

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6
                 border-b border-gray-200 bg-white shrink-0"
    >
      {/* ── Left: Hamburger (mobile) + Page Title ──────────────────────── */}
      <div className="flex items-center gap-4">

        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500
                     hover:bg-gray-100 transition-colors duration-150"
          aria-label="Open navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor"
            strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page Title */}
        {pageTitle && (
          <h1 className="text-base font-semibold" style={{ color: "#1B263B" }}>
            {pageTitle}
          </h1>
        )}
      </div>

      {/* ── Right: User Info + Logout ───────────────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* User Info */}
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-sm font-medium leading-tight" style={{ color: "#1B263B" }}>
            {name}
          </p>
          <p className="text-xs text-gray-400 capitalize">{role}</p>
        </div>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center
                     text-sm font-bold shrink-0"
          style={{ backgroundColor: "#1B263B", color: "#59ABBD" }}
        >
          {initials}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                     font-medium text-gray-500 transition-all duration-150
                     hover:bg-red-50 hover:text-red-600"
          title="Sign out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor"
            strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
                 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}