// src/pages/Departments.jsx
// M2 — Sprint 2 PR-03: feat/ui-job-dept
// Uses:
//   M4 → useRights()           returns { rights: {}, loading: boolean }
//   M4 → useCurrentUser()      gets user_type for stamp + INACTIVE gating
//   M1 → departmentService     real Supabase service calls

import { useState, useEffect, useMemo } from "react";
import { useRights }      from "../hooks/useRights";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { departmentService } from "../services/departmentService"; // FIX: Corrected import name and path

// ─── Shared: Input ───────────────────────────────────────────────────────────
function Input({ id, label, value, onChange, required, disabled, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: "#1B263B" }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
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

// ─── Shared: Modal ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#1B263B", borderRadius: "1rem 1rem 0 0" }}>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Shared: Primary Button ──────────────────────────────────────────────────
function PrimaryBtn({ onClick, disabled, loading, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                 transition-all hover:opacity-90 active:scale-[0.98]
                 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: "#1B263B" }}
      onMouseEnter={e => {
        if (!disabled && !loading) e.currentTarget.style.backgroundColor = "#59ABBD";
      }}
      onMouseLeave={e => {
        if (!disabled && !loading) e.currentTarget.style.backgroundColor = "#1B263B";
      }}
    >
      {loading ? "Saving…" : children}
    </button>
  );
}

// ─── Add Dept Modal ───────────────────────────────────────────────────────────
function AddDeptModal({ onClose, onSave }) {
<<<<<<< HEAD
  const [form, setForm]           = useState({ deptCode: "", deptName: "" });
  const [errors, setErrors]       = useState({});
=======
  // FIX: Form fields changed to use lowercase keys to match database payload targets
  const [form,      setForm]      = useState({ deptcode: "", deptname: "" });
  const [errors,    setErrors]    = useState({});
>>>>>>> pr-77-local
  const [isLoading, setIsLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.deptcode.trim()) e.deptcode = "Department code is required.";
    if (!form.deptname.trim()) e.deptname = "Department name is required.";
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setServerErr("");
    setIsLoading(true);
    try {
      await onSave({
<<<<<<< HEAD
        deptCode: form.deptCode.toUpperCase(),
        deptName: form.deptName,
        record_status: "ACTIVE",
        stamp: `ADDED-${new Date().toISOString()}`,
=======
        deptcode:      form.deptcode.toUpperCase(),
        deptname:      form.deptname,
        record_status: "ACTIVE",
>>>>>>> pr-77-local
      });
      onClose();
    } catch (err) {
      setServerErr(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal title="Add Department" onClose={onClose}>
      <div className="space-y-4">
        {serverErr && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-200">{serverErr}</p>
        )}
<<<<<<< HEAD
        <Input id="deptCode" label="Dept Code" value={form.deptCode} onChange={set("deptCode")} required error={errors.deptCode} />
        <Input id="deptName" label="Department Name" value={form.deptName} onChange={set("deptName")} required error={errors.deptName} />
=======
        <Input id="deptcode" label="Dept Code" value={form.deptcode}
          onChange={set("deptcode")} required error={errors.deptcode} />
        <Input id="deptname" label="Department Name" value={form.deptname}
          onChange={set("deptname")} required error={errors.deptname} />
>>>>>>> pr-77-local
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <PrimaryBtn onClick={handleSave} loading={isLoading}>Save</PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Dept Modal ──────────────────────────────────────────────────────────
function EditDeptModal({ row, onClose, onSave }) {
<<<<<<< HEAD
  const [form, setForm]           = useState({ deptName: row.deptName ?? "" });
=======
  // FIX: Access object data using lowercase .deptname column key
  const [form,      setForm]      = useState({ deptname: row.deptname ?? "" });
>>>>>>> pr-77-local
  const [isLoading, setIsLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  async function handleSave() {
    setServerErr("");
    setIsLoading(true);
    try {
<<<<<<< HEAD
      await onSave(row.deptCode, {
        deptName: form.deptName,
        stamp: `EDITED-${new Date().toISOString()}`,
=======
      // FIX: Access object data using lowercase .deptcode constraint key
      await onSave(row.deptcode, {
        deptname: form.deptname,
>>>>>>> pr-77-local
      });
      onClose();
    } catch (err) {
      setServerErr(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal title={`Edit Department — ${row.deptcode ?? ""}`} onClose={onClose}>
      <div className="space-y-4">
        {serverErr && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-200">{serverErr}</p>
        )}
<<<<<<< HEAD
        <Input id="e-deptCode" label="Dept Code" value={row.deptCode} disabled />
        <Input id="e-deptName" label="Department Name" value={form.deptName} onChange={e => setForm(p => ({ ...p, deptName: e.target.value }))} />
=======
        <Input id="e-deptcode" label="Dept Code" value={row.deptcode} disabled />
        <Input id="e-deptname" label="Department Name" value={form.deptname}
          onChange={e => setForm(p => ({ ...p, deptname: e.target.value }))} />
>>>>>>> pr-77-local
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <PrimaryBtn onClick={handleSave} loading={isLoading}>Save Changes</PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Soft Delete Dialog ──────────────────────────────────────────────────────
function SoftDeleteDialog({ row, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal title="Confirm Soft Delete" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <svg className="w-8 h-8 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-700">This will soft-delete this department.</p>
            <p className="text-xs text-red-500 mt-1">Sets record_status = INACTIVE. Recoverable from Deleted Items.</p>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
<<<<<<< HEAD
          <p className="text-sm font-semibold" style={{ color: "#1B263B" }}>{row.deptCode}</p>
          <p className="text-xs text-gray-500 mt-0.5">{row.deptName}</p>
=======
          <p className="text-sm font-semibold" style={{ color: "#1B263B" }}>
            {/* FIX: Read from row.deptcode */}
            {row.deptcode}
          </p>
          {/* FIX: Read from row.deptname */}
          <p className="text-xs text-gray-500 mt-0.5">{row.deptname}</p>
>>>>>>> pr-77-local
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={isLoading} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? "Deleting…" : "Yes, Soft Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main: Departments Page ───────────────────────────────────────────────────
export default function Departments() {
  const currentUser  = useCurrentUser();

  // 1. Safe extraction with object fallback to prevent null runtime crashes
  const rightsData = useRights() || { rights: {}, loading: true };
  const rights = rightsData.rights || {};
  const isRightsLoading = rightsData.loading;

  // 2. Evaluate permissions explicitly out of the rights mapping object
  const canAdd  = rights["DEPT_ADD"] === true;
  const canEdit = rights["DEPT_EDIT"] === true;
  const canDel  = rights["DEPT_DEL"] === true;

  const isPrivileged = currentUser?.user_type === "ADMIN" || currentUser?.user_type === "SUPERADMIN";

  const [rows, setRows]           = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchErr, setFetchErr]   = useState("");
  const [search, setSearch]       = useState("");
  const [showAdd, setShowAdd]     = useState(false);
  const [editRow, setEditRow]     = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  // 3. Update the global loader flag to observe background auth compile states
  const isGlobalLoading = isLoading || isRightsLoading;

  useEffect(() => {
    if (!currentUser) return;
    loadAll();
  }, [currentUser]);

  async function loadAll() {
    setIsLoading(true);
    setFetchErr("");
    try {
      const { data, error } = await departmentService.getDepartments(currentUser?.user_type ?? "USER");
      if (error) throw error;
      setRows(data ?? []);
    } catch (err) {
      setFetchErr(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const visible = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    // FIX: Filter rows natively via lowercase .deptcode and .deptname fields
    return rows.filter(r =>
      (r.deptcode ?? "").toLowerCase().includes(q) ||
      (r.deptname ?? "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  async function handleAdd(data) {
    const { error } = await departmentService.addDepartment(data);
    if (error) throw error;
    await loadAll();
  }

  async function handleEdit(deptCode, updates) {
    const { error } = await departmentService.updateDepartment(deptCode, updates);
    if (error) throw error;
    await loadAll();
  }

  async function handleDelete() {
<<<<<<< HEAD
    if (!deleteRow) return;
    await deptService.softDeleteDept(deleteRow.deptCode);
=======
    // FIX: Access target identifying key using lowercase .deptcode property
    const { error } = await departmentService.softDeleteDepartment(deleteRow.deptcode, currentUser?.id ?? "");
    if (error) throw error;
>>>>>>> pr-77-local
    await loadAll();
  }

  if (isGlobalLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
          <p className="text-sm text-gray-500">Loading departments…</p>
        </div>
      </div>
    );
  }

  if (fetchErr) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-medium">{fetchErr}</p>
          <button onClick={loadAll} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "#1B263B" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Departments
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visible.length} record{visible.length !== 1 ? "s" : ""}
            {!isPrivileged && " · Active records only"}
          </p>
        </div>
        {canAdd === true && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg
                       text-sm font-semibold text-white shadow-sm
                       transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#1B263B" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#59ABBD"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#1B263B"; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Department
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dept code, name…"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white outline-none transition-all"
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

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1B263B" }}>
                {[
                  "Dept Code",
                  "Department Name",
                  ...(isPrivileged ? ["Status", "Stamp"] : []),
                  "Actions",
                ].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={99} className="px-4 py-14 text-center text-gray-400 text-sm">
                    No department records found.
                  </td>
                </tr>
<<<<<<< HEAD
              ) : (
                visible.map((row, i) => (
                  <tr
                    key={row.deptCode}
                    className="transition-colors duration-100"
                    style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#fff" : "#F9FAFB";
                    }}
                  >
                    <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap" style={{ color: "#59ABBD" }}>
                      {row.deptCode}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.deptName}</td>
                    {isPrivileged && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                         ${row.record_status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {row.record_status}
                        </span>
                      </td>
                    )}
                    {isPrivileged && (
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate" title={row.stamp}>
                        {row.stamp ?? "—"}
                      </td>
                    )}
=======
              ) : visible.map((row, i) => (
                // FIX: Key property updated to read from lowercase row.deptcode
                <tr key={row.deptcode}
                  className="transition-colors duration-100"
                  style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "#fff" : "#F9FAFB";
                  }}>
                  {/* FIX: Render text content strings using lowercase row.deptcode and row.deptname fields */}
                  <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap"
                    style={{ color: "#59ABBD" }}>{row.deptcode}</td>
                  <td className="px-4 py-3 text-gray-700">{row.deptname}</td>
                  {isPrivileged && (
>>>>>>> pr-77-local
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {canEdit === true && (
                          <button
                            onClick={() => setEditRow(row)}
                            title="Edit"
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            style={{ color: "#59ABBD" }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {canDel === true && row.record_status === "ACTIVE" && (
                          <button
                            onClick={() => setDeleteRow(row)}
                            title="Soft delete"
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAdd && <AddDeptModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {editRow && <EditDeptModal row={editRow} onClose={() => setEditRow(null)} onSave={handleEdit} />}
      {deleteRow && <SoftDeleteDialog row={deleteRow} onClose={() => setDeleteRow(null)} onConfirm={handleDelete} />}
    </div>
  );
}