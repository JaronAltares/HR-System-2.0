import { useState, useEffect } from "react";
import reportService from "../services/reportService";

export default function EmployeeHistoryReportPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [history, setHistory] = useState([]);
  
  const [initLoading, setInitLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLookupRegistry();
  }, []);

  async function loadLookupRegistry() {
    try {
      setInitLoading(true);
      const res = await reportService.getEmployeesWithCurrentJob();
      setEmployees(res);
    } catch (err) {
      setError("Failed to construct employee directory.");
    } finally {
      setInitLoading(false);
    }
  }

  async function handleSelectionChange(empno) {
    setSelectedEmp(empno);
    if (!empno) {
      setHistory([]);
      return;
    }

    try {
      setHistoryLoading(true);
      const data = await reportService.getEmployeeFullHistory(empno);
      setHistory(data);
    } catch (err) {
      alert("Error generating target timeline arrays.");
    } finally {
      setHistoryLoading(false);
    }
  }

  function fmtDate(d) {
    if (!d) return "Present";
    return new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "2-digit" });
  }

  function peso(val) {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val || 0);
  }

  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
        <p className="text-sm text-gray-500">Assembling historical query indexes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Chronological Career Progression Lifecycle
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Select an corporate profile record to render a unified historical mapping of promotions, changes, and salary trends.
        </p>
      </div>

      {/* Select Box Controller */}
      <div className="max-w-md p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Target Corporate Resource</label>
        <select
          value={selectedEmp}
          onChange={(e) => handleSelectionChange(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none transition-all"
          style={{ focusColor: "#59ABBD" }}
        >
          <option value="">-- Choose employee tracking identifier --</option>
          {employees.map((emp) => (
            <option key={emp.empno} value={emp.empno}>
              [{emp.empno}] {emp.lastname}, {emp.firstname} — {emp.jobDesc || "No Role"}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline Display Outputs */}
      {historyLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-transparent border-t-slate-500 animate-spin" />
        </div>
      ) : selectedEmp === "" ? (
        <div className="text-center p-14 border border-dashed border-gray-200 rounded-xl bg-white text-sm text-gray-400 italic">
          Awaiting core tracking key activation parameters. Select an employee to begin.
        </div>
      ) : history.length === 0 ? (
        <div className="text-center p-14 border border-dashed border-gray-200 rounded-xl bg-white text-sm text-gray-400">
          No historical logging matches detected on this target employee.
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-6">
          {history.map((record, index) => (
            <div key={index} className="relative group">
              {/* Timeline Indicator Dot */}
              <div 
                className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white transition-all duration-300 group-hover:scale-125 shadow-sm"
                style={{ backgroundColor: index === 0 ? "#59ABBD" : "#1B263B" }}
              />
              
              {/* Event Card Panel */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs max-w-2xl hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-2 mb-2">
                  <span className="text-xs font-bold font-mono tracking-wide px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 self-start sm:self-auto">
                    Effective: {fmtDate(record.effDate)}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700">{peso(record.salary)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm pt-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Assigned Profile Role</p>
                    <p className="font-semibold mt-0.5 text-slate-800">{record.jobDesc} <span className="font-mono text-xs text-gray-400 font-normal">({record.jobCode})</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Allocated Business Unit</p>
                    <p className="font-medium mt-0.5 text-slate-700">{record.deptName} <span className="font-mono text-xs text-gray-400 font-normal">({record.deptCode})</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}