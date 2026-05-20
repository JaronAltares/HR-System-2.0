// src/pages/DeletedItems.jsx
// M2 — Sprint 2 PR-03: feat/ui-job-dept
// Uses:
//   M4 → useCurrentUser()   gets user_type for ADMIN/SUPERADMIN gating
//   M1 → all 4 services     recover functions

import { useState, useEffect } from "react";
import { useCurrentUser }    from "../hooks/useCurrentUser";
import employeeService       from "../services/employeeService";
import jobHistoryService     from "../services/jobHistoryService";
import jobService            from "../services/jobService";
import deptService           from "../services/deptService";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "2-digit",
  });
}

// ─── Shared: Tab Button ───────────────────────────────────────────────────────
function Tab({ label, count, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all
                  ${active
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
      style={active ? { backgroundColor: "#1B263B" } : {}}>
      {label}
      {count > 0 && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                          ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Shared: Recover Button ───────────────────────────────────────────────────
function RecoverBtn({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white
                 transition-all hover:opacity-90 disabled:opacity-60
                 disabled:cursor-not-allowed"
      style={{ backgroundColor: "#59ABBD" }}>
      {loading ? "Recovering…" : "Recover"}
    </button>
  );
}

// ─── Tab: Deleted Employees ───────────────────────────────────────────────────
function DeletedEmployees({ currentUser, onCountChange }) {
  const [rows,      setRows]      = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recovering, setRecovering] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setIsLoading(true);
    try {
      const { data } = await employeeService.getEmployees(
        currentUser?.user_type ?? "ADMIN"
      );
      const inactive = (data ?? []).filter(e => e.record_status === "INACTIVE");
      setRows(inactive);
      onCountChange(inactive.length);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRecover(empno) {
    setRecovering(empno);
    try {
      await employeeService.recoverEmployee(empno);
      await loadAll();
    } finally {
      setRecovering(null);
    }
  }

  if (isLoading) return <LoadingSpinner label="employees" />;
  if (rows.length === 0) return <EmptyState label="deleted employees" />;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#1B263B" }}>
              {["Emp No.", "Last Name", "First Name", "Gender",
                "Hire Date", "Stamp", "Action"].map(h => (
                <th key={h}
                  className="px-4 py-3 text-left text-xs font-semibold
                             text-white uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, i) => (
              <tr key={row.empno}
                style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "#fff" : "#F9FAFB";
                }}>
                <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap"
                  style={{ color: "#59ABBD" }}>{row.empno}</td>
                <td className="px-4 py-3 text-gray-700">{row.lastname}</td>
                <td className="px-4 py-3 text-gray-700">{row.firstname}</td>
                <td className="px-4 py-3 text-gray-500">{row.gender}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {fmt(row.hiredate)}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400
                               max-w-[160px] truncate" title={row.stamp}>
                  {row.stamp ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <RecoverBtn
                    onClick={() => handleRecover(row.empno)}
                    loading={recovering === row.empno}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Deleted Job History ─────────────────────────────────────────────────
function DeletedJobHistory({ currentUser, onCountChange }) {
  const [rows,       setRows]       = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [recovering, setRecovering] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setIsLoading(true);
    try {
      const data = await jobHistoryService.getJobHistory(
        null, currentUser?.user_type ?? "ADMIN"
      );
      const inactive = (data ?? []).filter(r => r.record_status === "INACTIVE");
      setRows(inactive);
      onCountChange(inactive.length);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRecover(row) {
    const key = `${row.empNo}-${row.jobCode}-${row.effDate}`;
    setRecovering(key);
    try {
      await jobHistoryService.recoverJobHistory(row.empNo, row.jobCode, row.effDate);
      await loadAll();
    } finally {
      setRecovering(null);
    }
  }

  if (isLoading) return <LoadingSpinner label="job history" />;
  if (rows.length === 0) return <EmptyState label="deleted job history" />;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#1B263B" }}>
              {["Emp No.", "Job Code", "Dept Code", "Eff. Date",
                "Salary", "Stamp", "Action"].map(h => (
                <th key={h}
                  className="px-4 py-3 text-left text-xs font-semibold
                             text-white uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, i) => {
              const key = `${row.empNo}-${row.jobCode}-${row.effDate}`;
              return (
                <tr key={key}
                  style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "#fff" : "#F9FAFB";
                  }}>
                  <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap"
                    style={{ color: "#59ABBD" }}>{row.empNo}</td>
                  <td className="px-4 py-3 text-gray-700">{row.jobCode}</td>
                  <td className="px-4 py-3 text-gray-500">{row.deptCode}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {fmt(row.effDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {row.salary ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400
                                 max-w-[160px] truncate" title={row.stamp}>
                    {row.stamp ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <RecoverBtn
                      onClick={() => handleRecover(row)}
                      loading={recovering === key}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Deleted Jobs ────────────────────────────────────────────────────────
function DeletedJobs({ currentUser, onCountChange }) {
  const [rows,       setRows]       = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [recovering, setRecovering] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setIsLoading(true);
    try {
      const data = await jobService.getJobs(currentUser?.user_type ?? "ADMIN");
      const inactive = (data ?? []).filter(r => r.record_status === "INACTIVE");
      setRows(inactive);
      onCountChange(inactive.length);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRecover(jobCode) {
    setRecovering(jobCode);
    try {
      await jobService.recoverJob(jobCode);
      await loadAll();
    } finally {
      setRecovering(null);
    }
  }

  if (isLoading) return <LoadingSpinner label="jobs" />;
  if (rows.length === 0) return <EmptyState label="deleted jobs" />;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#1B263B" }}>
              {["Job Code", "Job Description", "Stamp", "Action"].map(h => (
                <th key={h}
                  className="px-4 py-3 text-left text-xs font-semibold
                             text-white uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, i) => (
              <tr key={row.jobCode}
                style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "#fff" : "#F9FAFB";
                }}>
                <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap"
                  style={{ color: "#59ABBD" }}>{row.jobCode}</td>
                <td className="px-4 py-3 text-gray-700">{row.jobDesc}</td>
                <td className="px-4 py-3 text-xs text-gray-400
                               max-w-[160px] truncate" title={row.stamp}>
                  {row.stamp ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <RecoverBtn
                    onClick={() => handleRecover(row.jobCode)}
                    loading={recovering === row.jobCode}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Deleted Departments ─────────────────────────────────────────────────
function DeletedDepts({ currentUser, onCountChange }) {
  const [rows,       setRows]       = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [recovering, setRecovering] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setIsLoading(true);
    try {
      const data = await deptService.getDepts(currentUser?.user_type ?? "ADMIN");
      const inactive = (data ?? []).filter(r => r.record_status === "INACTIVE");
      setRows(inactive);
      onCountChange(inactive.length);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRecover(deptCode) {
    setRecovering(deptCode);
    try {
      await deptService.recoverDept(deptCode);
      await loadAll();
    } finally {
      setRecovering(null);
    }
  }

  if (isLoading) return <LoadingSpinner label="departments" />;
  if (rows.length === 0) return <EmptyState label="deleted departments" />;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#1B263B" }}>
              {["Dept Code", "Department Name", "Stamp", "Action"].map(h => (
                <th key={h}
                  className="px-4 py-3 text-left text-xs font-semibold
                             text-white uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, i) => (
              <tr key={row.deptCode}
                style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "#fff" : "#F9FAFB";
                }}>
                <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap"
                  style={{ color: "#59ABBD" }}>{row.deptCode}</td>
                <td className="px-4 py-3 text-gray-700">{row.deptName}</td>
                <td className="px-4 py-3 text-xs text-gray-400
                               max-w-[160px] truncate" title={row.stamp}>
                  {row.stamp ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <RecoverBtn
                    onClick={() => handleRecover(row.deptCode)}
                    loading={recovering === row.deptCode}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Shared: Loading Spinner ──────────────────────────────────────────────────
function LoadingSpinner({ label }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-transparent animate-spin"
          style={{ borderTopColor: "#59ABBD" }} />
        <p className="text-sm text-gray-500">Loading {label}…</p>
      </div>
    </div>
  );
}

// ─── Shared: Empty State ──────────────────────────────────────────────────────
function EmptyState({ label }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-2">
        <svg className="w-12 h-12 mx-auto text-gray-300" fill="none"
          stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25
               2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25
               c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125
               -1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375
               c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p className="text-sm text-gray-400">No {label} found.</p>
      </div>
    </div>
  );
}

// ─── Main: DeletedItems Page ──────────────────────────────────────────────────
export default function DeletedItems() {
  const currentUser  = useCurrentUser();
  const isPrivileged = currentUser?.user_type === "ADMIN" ||
                       currentUser?.user_type === "SUPERADMIN";

  const [activeTab, setActiveTab] = useState("employees");
  const [counts,    setCounts]    = useState({
    employees: 0, jobHistory: 0, jobs: 0, departments: 0,
  });

  const setCount = key => val =>
    setCounts(prev => ({ ...prev, [key]: val }));

  if (!isPrivileged) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none"
            stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75
                 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25
                 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25
                 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-gray-500 font-medium">Access Restricted</p>
          <p className="text-sm text-gray-400">
            Only ADMIN and SUPERADMIN can view deleted items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold"
          style={{ color: "#1B263B",
                   fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Deleted Items
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          INACTIVE records — recoverable by ADMIN and SUPERADMIN
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <Tab label="Employees"   count={counts.employees}
          active={activeTab === "employees"}
          onClick={() => setActiveTab("employees")} />
        <Tab label="Job History" count={counts.jobHistory}
          active={activeTab === "jobHistory"}
          onClick={() => setActiveTab("jobHistory")} />
        <Tab label="Jobs"        count={counts.jobs}
          active={activeTab === "jobs"}
          onClick={() => setActiveTab("jobs")} />
        <Tab label="Departments" count={counts.departments}
          active={activeTab === "departments"}
          onClick={() => setActiveTab("departments")} />
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "employees" && (
        <DeletedEmployees
          currentUser={currentUser}
          onCountChange={setCount("employees")}
        />
      )}
      {activeTab === "jobHistory" && (
        <DeletedJobHistory
          currentUser={currentUser}
          onCountChange={setCount("jobHistory")}
        />
      )}
      {activeTab === "jobs" && (
        <DeletedJobs
          currentUser={currentUser}
          onCountChange={setCount("jobs")}
        />
      )}
      {activeTab === "departments" && (
        <DeletedDepts
          currentUser={currentUser}
          onCountChange={setCount("departments")}
        />
      )}
    </div>
  );
}
// Force commit change
