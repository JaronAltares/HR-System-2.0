// src/pages/Employees.jsx
// M2 – Sprint 2 PR-01: feat/ui-employee-list
// Uses:
//   M4 → useRights(rightName)  returns true | false | null
//   M4 → useAuth()             returns { user, loading }
//   M1 → employeeService       real Supabase service calls
//   M2 → useCurrentUser()      gets user_type for stamp + INACTIVE gating

import { useState, useEffect, useMemo } from "react";
import { useRights }        from "../hooks/useRights";
import { useCurrentUser }   from "../hooks/useCurrentUser";
import { useAuth }          from "../context/AuthContext";
import { employeeService }  from "../services/employeeService";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "2-digit",
  });
}

// ─── Shared: Input ─────────────────────────────────────────────────────────────
function Input({ id, label, type = "text", value, onChange,
                 required, maxLength, disabled, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium"
        style={{ color: "#1B263B" }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id} type={type} value={value ?? ""} onChange={onChange}
        maxLength={maxLength} disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-white
                   text-gray-900 outline-none transition-all
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   ${error ? "border-red-400" : "border-gray-300"}`}
        onFocus={e => {
          if (!error) {
            e.target.style.borderColor = "#59ABBD";
            e.target.style.boxShadow   = "0 0 0 3px #59ABBD22";
          }
        }}
        onBlur={e => {
          e.target.style.borderColor = "";
          e.target.style.boxShadow   = "";
        }}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

// ─── Shared: Select ────────────────────────────────────────────────────────────
function Select({ id, label, value, onChange, required, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium"
        style={{ color: "#1B263B" }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select id={id} value={value} onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5
                   text-sm bg-white outline-none transition-all"
        onFocus={e => { e.target.style.borderColor = "#59ABBD"; }}
        onBlur={e  => { e.target.style.borderColor = ""; }}>
        {children}
      </select>
    </div>
  );
}

// ─── Shared: Modal Wrapper ─────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
                    p-4 bg-black/40 backdrop-blur-sm">
      <div className={`w-full ${width} bg-white rounded-2xl shadow-2xl
                       flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "#1B263B", borderRadius: "1rem 1rem 0 0" }}>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} aria-label="Close"
            className="text-white/60 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
              strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Shared: Primary Button ────────────────────────────────────────────────────
function PrimaryBtn({ onClick, disabled, loading, children }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                 transition-all hover:opacity-90 active:scale-[0.98]
                 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: "#1B263B" }}
      onMouseEnter={e => {
        if (!disabled && !loading)
          e.currentTarget.style.backgroundColor = "#59ABBD";
      }}
      onMouseLeave={e => {
        if (!disabled && !loading)
          e.currentTarget.style.backgroundColor = "#1B263B";
      }}>
      {loading ? "Saving…" : children}
    </button>
  );
}

// ─── Add Employee Modal ────────────────────────────────────────────────────────
function AddEmployeeModal({ onClose, onSave }) {
  const EMPTY = {
    empno: "", lastname: "", firstname: "",
    gender: "M", birthdate: "", hiredate: "", sepDate: "",
  };
  const [form,      setForm]      = useState(EMPTY);
  const [errors,    setErrors]    = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.empno.trim())     e.empno     = "Employee number is required.";
    if (!form.lastname.trim())  e.lastname  = "Last name is required.";
    if (!form.firstname.trim()) e.firstname = "First name is required.";
    if (!form.birthdate)        e.birthdate = "Birth date is required.";
    if (!form.hiredate)         e.hiredate  = "Hire date is required.";
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setServerErr("");
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        sepDate:       form.sepDate || null,
        record_status: "ACTIVE",
      };
      const { error } = await onSave(payload);
      if (error) { setServerErr(error.message); return; }
      onClose();
    } finally { setIsLoading(false); }
  }

  return (
    <Modal title="Add New Employee" onClose={onClose}>
      <div className="space-y-4">
        {serverErr && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-200">
            {serverErr}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Input id="empno" label="Employee No." value={form.empno}
            onChange={set("empno")} maxLength={5} required error={errors.empno} />
          <Select id="gender" label="Gender" value={form.gender}
            onChange={set("gender")} required>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input id="lastname"  label="Last Name"  value={form.lastname}
            onChange={set("lastname")}  maxLength={15} required error={errors.lastname} />
          <Input id="firstname" label="First Name" value={form.firstname}
            onChange={set("firstname")} maxLength={15} required error={errors.firstname} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input id="birthdate" label="Birth Date" type="date"
            value={form.birthdate} onChange={set("birthdate")}
            required error={errors.birthdate} />
          <Input id="hiredate" label="Hire Date" type="date"
            value={form.hiredate} onChange={set("hiredate")}
            required error={errors.hiredate} />
        </div>
        <Input id="sepDate" label="Separation Date (optional)" type="date"
          value={form.sepDate} onChange={set("sepDate")} />

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} disabled={isLoading}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600
                       border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <PrimaryBtn onClick={handleSave} loading={isLoading}>
            Save Employee
          </PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Employee Modal ───────────────────────────────────────────────────────
function EditEmployeeModal({ employee, onClose, onSave }) {
  const [form, setForm] = useState({
    empno:     employee.empno,
    lastname:  employee.lastname,
    firstname: employee.firstname,
    gender:    employee.gender    ?? "M",
    birthdate: employee.birthdate ?? "",
    hiredate:  employee.hiredate  ?? "",
    sepDate:   employee.sepDate   ?? "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleSave() {
    setServerErr("");
    setIsLoading(true);
    try {
      const updates = {
        lastname:  form.lastname,
        firstname: form.firstname,
        gender:    form.gender,
        birthdate: form.birthdate || null,
        hiredate:  form.hiredate  || null,
        sepDate:   form.sepDate   || null,
      };
      const { error } = await onSave(form.empno, updates);
      if (error) { setServerErr(error.message); return; }
      onClose();
    } finally { setIsLoading(false); }
  }

  return (
    <Modal title={`Edit Employee — ${employee.empno}`} onClose={onClose}>
      <div className="space-y-4">
        {serverErr && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-200">
            {serverErr}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Input id="e-empno" label="Employee No." value={form.empno} disabled />
          <Select id="e-gender" label="Gender" value={form.gender} onChange={set("gender")}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input id="e-lastname"  label="Last Name"  value={form.lastname}
            onChange={set("lastname")}  maxLength={15} />
          <Input id="e-firstname" label="First Name" value={form.firstname}
            onChange={set("firstname")} maxLength={15} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input id="e-birthdate" label="Birth Date" type="date"
            value={form.birthdate} onChange={set("birthdate")} />
          <Input id="e-hiredate"  label="Hire Date"  type="date"
            value={form.hiredate}  onChange={set("hiredate")} />
        </div>
        <Input id="e-sepDate" label="Separation Date (optional)" type="date"
          value={form.sepDate} onChange={set("sepDate")} />

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} disabled={isLoading}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600
                       border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <PrimaryBtn onClick={handleSave} loading={isLoading}>
            Save Changes
          </PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Soft Delete Confirm ───────────────────────────────────────────────────────
function SoftDeleteDialog({ employee, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setIsLoading(false); }
  }

  return (
    <Modal title="Confirm Soft Delete" onClose={onClose} width="max-w-md">
      <div className="space-y-4">
        <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <svg className="w-8 h-8 text-red-500 shrink-0"
            fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948
                 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697
                 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-700">
              This will soft-delete this employee and all their job history.
            </p>
            <p className="text-xs text-red-500 mt-1">
              Sets record_status = INACTIVE. Recoverable from Deleted Items.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
          <p className="text-sm font-semibold" style={{ color: "#1B263B" }}>
            {employee.lastname}, {employee.firstname}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Emp No: {employee.empno}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onClose} disabled={isLoading}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600
                       border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={isLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                       bg-red-600 hover:bg-red-700 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? "Deleting…" : "Yes, Soft Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Employees Page ────────────────────────────────────────────────────────────
export default function Employees() {
  // ── Auth & Rights ────────────────────────────────────────────────────────────
  const { user }    = useAuth();
  const currentUser = useCurrentUser();
  const canAdd      = useRights("EMP_ADD");
  const canEdit     = useRights("EMP_EDIT");
  const canDel      = useRights("EMP_DEL");

  const isPrivileged = currentUser?.user_type === "ADMIN" ||
                       currentUser?.user_type === "SUPERADMIN";

  // ── Data State ───────────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchErr,  setFetchErr]  = useState("");

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [search,    setSearch]    = useState("");
  const [showAdd,   setShowAdd]   = useState(false);
  const [editRow,   setEditRow]   = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  // ── Load employees on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return; // wait for user_type before fetching
    loadEmployees();
  }, [currentUser]);

  async function loadEmployees() {
    setIsLoading(true);
    setFetchErr("");
    const { data, error } = await employeeService.getEmployees(
      currentUser?.user_type ?? "USER"
    );
    if (error) { setFetchErr(error.message); setIsLoading(false); return; }
    setEmployees(data ?? []);
    setIsLoading(false);
  }

  // ── Filtered rows ────────────────────────────────────────────────────────────
  const visible = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(e =>
      e.empno.includes(q)                                ||
      e.lastname.toLowerCase().includes(q)              ||
      e.firstname.toLowerCase().includes(q)             ||
      (e.currentJob  ?? "").toLowerCase().includes(q)   ||
      (e.currentDept ?? "").toLowerCase().includes(q)
    );
  }, [employees, search]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  async function handleAdd(data) {
    const result = await employeeService.addEmployee(data);
    if (!result.error) await loadEmployees();
    return result;
  }

  async function handleEdit(empno, updates) {
    const result = await employeeService.updateEmployee(empno, updates);
    if (!result.error) await loadEmployees();
    return result;
  }

  async function handleDelete() {
    await employeeService.softDeleteEmployee(deleteRow.empno, user?.id ?? "");
    await loadEmployees();
  }

  // ── Loading State ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-transparent
                          animate-spin"
            style={{ borderTopColor: "#59ABBD" }} />
          <p className="text-sm text-gray-500">Loading employees…</p>
        </div>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────────
  if (fetchErr) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-medium">{fetchErr}</p>
          <button onClick={loadEmployees}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "#1B263B" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold"
            style={{ color: "#1B263B",
                     fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Employees
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visible.length} record{visible.length !== 1 ? "s" : ""}
            {!isPrivileged && " · Active records only"}
          </p>
        </div>

        {/* Add — only when right is exactly true */}
        {canAdd === true && (
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg
                       text-sm font-semibold text-white shadow-sm
                       transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#1B263B" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#59ABBD"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#1B263B"; }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor"
              strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </button>
        )}
      </div>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, empno, job…"
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

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1B263B" }}>
                {[
                  "Emp No.", "Last Name", "First Name", "Gender",
                  "Hire Date", "Sep. Date",
                  ...(isPrivileged ? ["Status", "Stamp"] : []),
                  "Actions",
                ].map(h => (
                  <th key={h}
                    className="px-4 py-3 text-left text-xs font-semibold
                               text-white uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={99}
                    className="px-4 py-14 text-center text-gray-400 text-sm">
                    No employee records found.
                  </td>
                </tr>
              ) : visible.map((emp, i) => (
                <tr key={emp.empno}
                  className="cursor-pointer transition-colors duration-100"
                  style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "#fff" : "#F9FAFB";
                  }}>

                  {/* Emp No */}
                  <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap"
                    style={{ color: "#59ABBD" }}>
                    {emp.empno}
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3 font-medium whitespace-nowrap"
                    style={{ color: "#1B263B" }}>
                    {emp.lastname}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {emp.firstname}
                  </td>
                  {/* Gender */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {emp.gender === "M" ? "Male" : "Female"}
                  </td>
                  {/* Dates */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {fmt(emp.hiredate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {fmt(emp.sepDate)}
                  </td>

                  {/* Status — ADMIN/SUPERADMIN only */}
                  {isPrivileged && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5
                                       rounded-full text-xs font-semibold
                                       ${emp.record_status === "ACTIVE"
                                         ? "bg-green-100 text-green-700"
                                         : "bg-red-100 text-red-600"}`}>
                        {emp.record_status}
                      </span>
                    </td>
                  )}

                  {/* Stamp — ADMIN/SUPERADMIN only */}
                  {isPrivileged && (
                    <td className="px-4 py-3 text-xs text-gray-400
                                   max-w-[160px] truncate"
                      title={emp.stamp}>
                      {emp.stamp ?? "—"}
                    </td>
                  )}

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap"
                    onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">

                      {/* Edit */}
                      {canEdit === true && (
                        <button onClick={() => setEditRow(emp)}
                          title="Edit employee"
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          style={{ color: "#59ABBD" }}>
                          <svg className="w-4 h-4" fill="none"
                            stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
                                 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
                                 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}

                      {/* Soft Delete — ACTIVE rows only */}
                      {canDel === true && emp.record_status === "ACTIVE" && (
                        <button onClick={() => setDeleteRow(emp)}
                          title="Soft delete"
                          className="p-1.5 rounded-lg hover:bg-red-50
                                     transition-colors text-red-400">
                          <svg className="w-4 h-4" fill="none"
                            stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
                                 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1
                                 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {showAdd && (
        <AddEmployeeModal
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}
      {editRow && (
        <EditEmployeeModal
          employee={editRow}
          onClose={() => setEditRow(null)}
          onSave={handleEdit}
        />
      )}
      {deleteRow && (
        <SoftDeleteDialog
          employee={deleteRow}
          onClose={() => setDeleteRow(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}