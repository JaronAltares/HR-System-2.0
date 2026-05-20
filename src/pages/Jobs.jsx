// src/pages/Jobs.jsx
// M2 — Sprint 2 PR-03: feat/ui-job-dept
// Uses:
//   M4 → useRights(rightName)  returns true | false | null
//   M4 → useCurrentUser()      gets user_type for stamp + INACTIVE gating
//   M1 → jobService            real Supabase service calls

import { useState, useEffect, useMemo } from "react";
import { useRights }      from "../hooks/useRights";
import { useCurrentUser } from "../hooks/useCurrentUser";
import jobService         from "../services/jobService";

// ─── Shared: Input ───────────────────────────────────────────────────────────
function Input({ id, label, value, onChange, required, disabled, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium"
        style={{ color: "#1B263B" }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id} value={value ?? ""} onChange={onChange}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center
                    p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl
                      flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "#1B263B", borderRadius: "1rem 1rem 0 0" }}>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose}
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

// ─── Shared: Primary Button ──────────────────────────────────────────────────
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

// ─── Add Job Modal ───────────────────────────────────────────────────────────
function AddJobModal({ onClose, onSave }) {
  const [form,      setForm]      = useState({ jobcode: "", jobdesc: "" });
  const [errors,    setErrors]    = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.jobcode.trim()) e.jobcode = "Job code is required.";
    if (!form.jobdesc.trim()) e.jobdesc = "Job description is required.";
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
        jobcode:       form.jobcode.toUpperCase(),
        jobdesc:       form.jobdesc,
        record_status: "ACTIVE",
        stamp:         `ADDED-${new Date().toISOString()}`,
      });
      onClose();
    } catch (err) {
      setServerErr(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal title="Add Job" onClose={onClose}>
      <div className="space-y-4">
        {serverErr && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3
                        border border-red-200">{serverErr}</p>
        )}
        <Input id="jobcode" label="Job Code" value={form.jobcode}
          onChange={set("jobcode")} required error={errors.jobcode} />
        <Input id="jobdesc" label="Job Description" value={form.jobdesc}
          onChange={set("jobdesc")} required error={errors.jobdesc} />
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} disabled={isLoading}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600
                       border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <PrimaryBtn onClick={handleSave} loading={isLoading}>Save</PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Job Modal ──────────────────────────────────────────────────────────
function EditJobModal({ row, onClose, onSave }) {
  const [form,      setForm]      = useState({ jobdesc: row.jobdesc ?? "" });
  const [isLoading, setIsLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  async function handleSave() {
    setServerErr("");
    setIsLoading(true);
    try {
      await onSave(row.jobcode, {
        jobdesc: form.jobdesc,
        stamp:   `EDITED-${new Date().toISOString()}`,
      });
      onClose();
    } catch (err) {
      setServerErr(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal title={`Edit Job — ${row.jobcode}`} onClose={onClose}>
      <div className="space-y-4">
        {serverErr && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3
                        border border-red-200">{serverErr}</p>
        )}
        <Input id="e-jobcode" label="Job Code" value={row.jobcode} disabled />
        <Input id="e-jobdesc" label="Job Description" value={form.jobdesc}
          onChange={e => setForm(p => ({ ...p, jobdesc: e.target.value }))} />
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

// ─── Soft Delete Dialog ──────────────────────────────────────────────────────
function SoftDeleteDialog({ row, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setIsLoading(false); }
  }

  return (
    <Modal title="Confirm Soft Delete" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <svg className="w-8 h-8 text-red-500 shrink-0" fill="none"
            stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948
                 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-700">
              This will soft-delete this job.
            </p>
            <p className="text-xs text-red-500 mt-1">
              Sets record_status = INACTIVE. Recoverable from Deleted Items.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
          <p className="text-sm font-semibold" style={{ color: "#1B263B" }}>
            {row.jobcode}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{row.jobdesc}</p>
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

// ─── Main: Jobs Page ─────────────────────────────────────────────────────────
export default function Jobs() {
  const currentUser  = useCurrentUser();
  const canAdd       = useRights("JOB_ADD");
  const canEdit      = useRights("JOB_EDIT");
  const canDel       = useRights("JOB_DEL");
  const isPrivileged = currentUser?.user_type === "ADMIN" ||
                       currentUser?.user_type === "SUPERADMIN";

  const [rows,      setRows]      = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchErr,  setFetchErr]  = useState("");
  const [search,    setSearch]    = useState("");
  const [showAdd,   setShowAdd]   = useState(false);
  const [editRow,   setEditRow]   = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    loadAll();
  }, [currentUser]);

  async function loadAll() {
    setIsLoading(true);
    setFetchErr("");
    try {
      const data = await jobService.getJobs(currentUser?.user_type ?? "USER");
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
    return rows.filter(r =>
      (r.jobcode ?? "").toLowerCase().includes(q) ||
      (r.jobdesc ?? "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  async function handleAdd(data) {
    await jobService.addJob(data);
    await loadAll();
  }

  async function handleEdit(jobcode, updates) {
    await jobService.updateJob(jobcode, updates);
    await loadAll();
  }

  async function handleDelete() {
    await jobService.softDeleteJob(deleteRow.jobcode);
    await loadAll();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: "#59ABBD" }} />
          <p className="text-sm text-gray-500">Loading jobs…</p>
        </div>
      </div>
    );
  }

  if (fetchErr) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-medium">{fetchErr}</p>
          <button onClick={loadAll}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "#1B263B" }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold"
            style={{ color: "#1B263B",
                     fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visible.length} record{visible.length !== 1 ? "s" : ""}
            {!isPrivileged && " · Active records only"}
          </p>
        </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Job
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search job code, description…"
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

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1B263B" }}>
                {[
                  "Job Code", "Job Description",
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
                    No job records found.
                  </td>
                </tr>
              ) : visible.map((row, i) => (
                <tr key={row.jobcode}
                  className="transition-colors duration-100"
                  style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "#fff" : "#F9FAFB";
                  }}>
                  <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap"
                    style={{ color: "#59ABBD" }}>{row.jobcode}</td>
                  <td className="px-4 py-3 text-gray-700">{row.jobdesc}</td>
                  {isPrivileged && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5
                                       rounded-full text-xs font-semibold
                                       ${row.record_status === "ACTIVE"
                                         ? "bg-green-100 text-green-700"
                                         : "bg-red-100 text-red-600"}`}>
                        {row.record_status}
                      </span>
                    </td>
                  )}
                  {isPrivileged && (
                    <td className="px-4 py-3 text-xs text-gray-400
                                   max-w-[160px] truncate" title={row.stamp}>
                      {row.stamp ?? "—"}
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {canEdit === true && (
                        <button onClick={() => setEditRow(row)}
                          title="Edit"
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          style={{ color: "#59ABBD" }}>
                          <svg className="w-4 h-4" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2
                                 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828
                                 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {canDel === true && row.record_status === "ACTIVE" && (
                        <button onClick={() => setDeleteRow(row)}
                          title="Soft delete"
                          className="p-1.5 rounded-lg hover:bg-red-50
                                     transition-colors text-red-400">
                          <svg className="w-4 h-4" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            viewBox="0 0 24 24">
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

      {/* ── Modals ── */}
      {showAdd && (
        <AddJobModal onClose={() => setShowAdd(false)} onSave={handleAdd} />
      )}
      {editRow && (
        <EditJobModal row={editRow} onClose={() => setEditRow(null)}
          onSave={handleEdit} />
      )}
      {deleteRow && (
        <SoftDeleteDialog row={deleteRow} onClose={() => setDeleteRow(null)}
          onConfirm={handleDelete} />
      )}
    </div>
  );
}