import { useState, useEffect } from "react";
import reportService from "../services/reportService";

export default function SalaryReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSalaries();
  }, []);

  async function fetchSalaries() {
    try {
      setLoading(true);
      const res = await reportService.getSalarySummaryByJob();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to compile financial summaries.");
    } finally {
      setLoading(false);
    }
  }

  function peso(val) {
    if (val === undefined || val === null) return "₱0.00";
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
        <p className="text-sm text-gray-500">Processing occupational market tracking variables...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={fetchSalaries} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "#1B263B" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Occupational Salary Summary
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Comprehensive payroll spread map isolating baseline floors, market average targets, and operational ceiling records.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1B263B" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Job Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Job Designation</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Active Instances</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Minimum Payroll Floor</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Market Mean Average</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Maximum Payroll Ceiling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-gray-400 text-sm italic">No data indexes registered.</td>
                </tr>
              ) : (
                data.map((job, idx) => (
                  <tr key={job.jobCode || idx} className="hover:bg-slate-50/80 transition-colors odd:bg-slate-50/30">
                    <td className="px-4 py-3 font-mono font-bold text-xs text-gray-500">{job.jobCode}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#1B263B" }}>{job.jobDesc}</td>
                    <td className="px-4 py-3 text-center text-gray-600 font-medium">{job.assignments || 0}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium text-gray-500">{peso(job.minSalary)}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">{peso(job.avgSalary)}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium text-gray-500">{peso(job.maxSalary)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}