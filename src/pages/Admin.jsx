// src/pages/Admin.jsx
// M2 — Sprint 3 PR-02: feat/rights-superadmin-guard
// UserManagementPage: table of all users with Activate/Deactivate buttons.
// SUPERADMIN rows are fully disabled with mandatory protective tooltip.
// Uses:
//   M4 → useRights()        ADM_USER right gates the whole page
//   M4 → useCurrentUser()   to get logged-in user's type
//   M1 → adminService       getUsers(), activateUser(), deactivateUser()

import { useState, useEffect, useMemo } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRights } from "../hooks/useRights";
import adminService from "../services/adminService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "2-digit",
  });
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                  text-xs font-semibold
                  ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
      />
      {status}
    </span>
  );
}

// ─── Role Badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const styles = {
    SUPERADMIN: "bg-purple-100 text-purple-700",
    ADMIN:      "bg-blue-100 text-blue-700",
    USER:       "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[role] ?? styles.USER}`}>
      {role}
    </span>
  );
}

// ─── Tooltip wrapper ───────────────────────────────────────────────────────────
function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                     px-3 py-1.5 rounded-lg text-xs font-medium text-white
                     whitespace-nowrap pointer-events-none shadow-lg"
          style={{ backgroundColor: "#1B263B" }}
        >
          {text}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "#1B263B" }}
          />
        </span>
      )}
    </span>
  );
}

// ─── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ user, action, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const isActivate = action === "activate";

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: "#1B263B" }}
        >
          <h2 className="text-base font-semibold text-white">
            {isActivate ? "Activate Account" : "Deactivate Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div
            className={`flex gap-3 p-4 rounded-xl border
              ${isActivate ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
          >
            {isActivate ? (
              <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            )}
            <div>
              <p className={`text-sm font-semibold ${isActivate ? "text-green-700" : "text-amber-700"}`}>
                {isActivate
                  ? "This will allow the user to sign in."
                  : "This will block the user from signing in."}
              </p>
              <p className={`text-xs mt-0.5 ${isActivate ? "text-green-600" : "text-amber-600"}`}>
                {isActivate
                  ? "Their rights will be restored immediately."
                  : "Their session will be invalidated on next login attempt."}
              </p>
            </div>
          </div>

          {/* User card */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: "#1B263B", color: "#59ABBD" }}
            >
              {(user.username || user.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1B263B" }}>
                {user.username || "—"}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="ml-auto">
              <RoleBadge role={user.user_type} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600
                         border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                          transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                          ${isActivate
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-amber-500 hover:bg-amber-600"}`}
            >
              {loading
                ? (isActivate ? "Activating…" : "Deactivating…")
                : (isActivate ? "Yes, Activate" : "Yes, Deactivate")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main: Admin / UserManagementPage ─────────────────────────────────────────
export default function Admin() {
  const currentUser = useCurrentUser();

  // ADM_USER right gates this page (M4 wires this)
  const rightsData  = useRights() || { rights: {}, loading: true };
  const rights      = rightsData.rights || {};
  const canManage   = rights["ADM_USER"] === true ||
                      currentUser?.user_type === "SUPERADMIN";

  const [users,     setUsers]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchErr,  setFetchErr]  = useState("");
  const [search,    setSearch]    = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Dialog state
  const [dialog, setDialog] = useState(null); // { user, action: 'activate'|'deactivate' }

  // Toast state
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }

  useEffect(() => {
    if (!currentUser) return;
    loadUsers();
  }, [currentUser]);

  async function loadUsers() {
    setIsLoading(true);
    setFetchErr("");
    try {
      const data = await adminService.getUsers(currentUser?.user_type ?? "ADMIN");
      setUsers(data ?? []);
    } catch (err) {
      setFetchErr(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleActivate(user) {
    if (user.user_type === "SUPERADMIN") return; // Double-layer defense interceptor
    try {
      await adminService.activateUser(user.userid, currentUser?.user_type);
      showToast(`${user.username || user.email} has been activated.`, "success");
      await loadUsers();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDeactivate(user) {
    if (user.user_type === "SUPERADMIN") return; // Double-layer defense interceptor
    try {
      await adminService.deactivateUser(user.userid, currentUser?.user_type);
      showToast(`${user.username || user.email} has been deactivated.`, "warning");
      await loadUsers();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const visible = useMemo(() => {
    return users.filter(u => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q ||
        (u.username ?? "").toLowerCase().includes(q) ||
        (u.email    ?? "").toLowerCase().includes(q) ||
        (u.user_type ?? "").toLowerCase().includes(q);
      const matchRole   = filterRole   === "ALL" || u.user_type     === filterRole;
      const matchStatus = filterStatus === "ALL" || u.record_status === filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, filterRole, filterStatus]);

  // ── Counts for filter pills ────────────────────────────────────────────────
  const counts = useMemo(() => ({
    active:   users.filter(u => u.record_status === "ACTIVE").length,
    inactive: users.filter(u => u.record_status === "INACTIVE").length,
    admin:    users.filter(u => u.user_type === "ADMIN").length,
    user:     users.filter(u => u.user_type === "USER").length,
  }), [users]);

  // ── Access denied ──────────────────────────────────────────────────────────
  if (!rightsData.loading && !canManage) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-gray-500 font-medium">Access Restricted</p>
          <p className="text-sm text-gray-400">
            Only users with the ADM_USER right can access this module.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading || rightsData.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: "#59ABBD" }} />
          <p className="text-sm text-gray-500">Loading user accounts…</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (fetchErr) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-medium">{fetchErr}</p>
          <button onClick={loadUsers}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "#1B263B" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Toast notification ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3
                      px-4 py-3 rounded-xl shadow-lg text-sm font-medium
                      text-white transition-all duration-300
                      ${toast.type === "success" ? "bg-green-600"
                        : toast.type === "warning" ? "bg-amber-500"
                        : "bg-red-600"}`}
        >
          {toast.type === "success" && (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {toast.type === "warning" && (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          )}
          {toast.type === "error" && (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visible.length} account{visible.length !== 1 ? "s" : ""} ·{" "}
            <span className="text-green-600 font-medium">{counts.active} active</span>
            {counts.inactive > 0 && (
              <>, <span className="text-gray-400">{counts.inactive} pending</span></>
            )}
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                     font-medium text-gray-500 border border-gray-300
                     hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── SUPERADMIN notice banner ── */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{ backgroundColor: "#F0F7FF", borderColor: "#BDDAF7" }}
      >
        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="#2563EB" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p style={{ color: "#1E40AF" }}>
          <span className="font-semibold">SUPERADMIN accounts cannot be modified.</span>{" "}
          Activate and Deactivate buttons are disabled for SUPERADMIN rows.
        </p>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search username, email, role…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300
                       text-sm bg-white outline-none transition-all"
            onFocus={e => {
              e.target.style.borderColor = "#59ABBD";
              e.target.style.boxShadow   = "0 0 0 3px #59ABBD22";
            }}
            onBlur={e => {
              e.target.style.borderColor = "";
              e.target.style.boxShadow   = "";
            }}
          />
        </div>

        {/* Role filter */}
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm
                     bg-white outline-none text-gray-700"
        >
          <option value="ALL">All roles</option>
          <option value="SUPERADMIN">SUPERADMIN</option>
          <option value="ADMIN">ADMIN ({counts.admin})</option>
          <option value="USER">USER ({counts.user})</option>
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm
                     bg-white outline-none text-gray-700"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active ({counts.active})</option>
          <option value="INACTIVE">Inactive ({counts.inactive})</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1B263B" }}>
                {["User", "Username", "Role", "Status", "Actions"].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold
                               text-white uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-gray-400 text-sm">
                    No user accounts found.
                  </td>
                </tr>
              ) : visible.map((user, i) => {
                const isSuperAdmin = user.user_type === "SUPERADMIN";
                const isActive     = user.record_status === "ACTIVE";

                return (
                  <tr
                    key={user.userid}
                    className="transition-colors duration-100"
                    style={{
                      backgroundColor: isSuperAdmin
                        ? "#FAFAFA"
                        : i % 2 === 0 ? "#fff" : "#F9FAFB",
                    }}
                    onMouseEnter={e => {
                      if (!isSuperAdmin)
                        e.currentTarget.style.backgroundColor = "#EFF6FF";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = isSuperAdmin
                        ? "#FAFAFA"
                        : i % 2 === 0 ? "#fff" : "#F9FAFB";
                    }}
                  >
                    {/* User cell — avatar + email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center
                                      text-xs font-bold shrink-0
                                      ${isSuperAdmin ? "opacity-50" : ""}`}
                          style={{
                            backgroundColor: isSuperAdmin ? "#9CA3AF" : "#1B263B",
                            color: "#59ABBD",
                          }}
                        >
                          {(user.username || user.email || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p
                            className={`text-xs ${isSuperAdmin ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {user.email ?? "—"}
                          </p>
                        </div>
                        {isSuperAdmin && (
                          <span
                            className="ml-1 px-1.5 py-0.5 rounded text-xs font-semibold
                                       bg-purple-100 text-purple-600"
                          >
                            Protected
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-medium ${isSuperAdmin ? "text-gray-400" : ""}`}
                        style={isSuperAdmin ? {} : { color: "#1B263B" }}
                      >
                        {user.username ?? "—"}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span className={isSuperAdmin ? "opacity-50" : ""}>
                        <RoleBadge role={user.user_type} />
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={isSuperAdmin ? "opacity-50" : ""}>
                        <StatusBadge status={user.record_status} />
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap text-left">
                      {isSuperAdmin ? (
                        /* 🔐 MANDATED SUPERADMIN ROW GUARD TOOLTIP */
                        <Tooltip text="SUPERADMIN accounts cannot be modified">
                          <div className="flex items-center gap-2">
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                         text-gray-300 border border-gray-200 bg-gray-50 cursor-not-allowed"
                            >
                              Activate
                            </button>
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                         text-gray-300 border border-gray-200 bg-gray-50 cursor-not-allowed"
                            >
                              Deactivate
                            </button>
                          </div>
                        </Tooltip>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Activate — only shown when INACTIVE */}
                          {!isActive && (
                            <button
                              onClick={() => setDialog({ user, action: "activate" })}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                         text-white bg-green-600 hover:bg-green-700
                                         transition-colors"
                            >
                              Activate
                            </button>
                          )}
                          {/* Deactivate — only shown when ACTIVE */}
                          {isActive && (
                            <button
                              onClick={() => setDialog({ user, action: "deactivate" })}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                         text-white bg-amber-500 hover:bg-amber-600
                                         transition-colors"
                            >
                              Deactivate
                            </button>
                          )}
                          {/* Status label for the other state */}
                          <span className="text-xs text-gray-400 italic">
                            {isActive ? "— active" : "— inactive"}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Confirm Dialog ── */}
      {dialog && (
        <ConfirmDialog
          user={dialog.user}
          action={dialog.action}
          onClose={() => setDialog(null)}
          onConfirm={() =>
            dialog.action === "activate"
              ? handleActivate(dialog.user)
              : handleDeactivate(dialog.user)
          }
        />
      )}
    </div>
  );
}