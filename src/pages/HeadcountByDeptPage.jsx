import { useState, useEffect } from "react";
import reportService from "../services/reportService";

export default function HeadcountByDeptPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHeadcount();
  }, []);

  async function fetchHeadcount() {
    try {
      setLoading(true);
      const res = await reportService.getHeadcountByDepartment();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load headcount statistics.");
    } finally {
      setLoading(false);
    }
  }

  const totalHeadcount = data.reduce((acc, curr) => acc + (curr.activeHeadcount || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
        <p className="text-sm text-gray-500">Loading headcount aggregates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={fetchHeadcount} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ backgroundColor: "#1B263B" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Department Headcount Report
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Real-time metrics tracking total active staff members distributed across active business departments.
        </p>
      </div>

      {/* KPI Card */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between max-w-sm">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-gray-400">Total Active Workspace Headcount</p>
          <p className="text-3xl font-extrabold mt-1" style={{ color: "#1B263B" }}>{totalHeadcount}</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-50">
          <svg className="w-6 h-6" fill="none" stroke="#1B263B" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
      </div>

      {/* Data Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Table Matrix View */}
        <div className="lg:col-span-3 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1B263B" }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Dept Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Department Name</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Active Headcount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-gray-400 italic">No department data found.</td>
                  </tr>
                ) : (
                  data.map((dept, index) => (
                    <tr key={dept.deptCode || index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-gray-600 text-xs">{dept.deptCode}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: "#1B263B" }}>{dept.deptName}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">{dept.activeHeadcount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSS Chart Bar Distribution Layout */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-700">Distribution Density</h3>
          <div className="space-y-3">
            {data.map((dept, idx) => {
              const percentage = totalHeadcount > 0 ? (dept.activeHeadcount / totalHeadcount) * 100 : 0;
              return (
                <div key={dept.deptCode || idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-600 truncate max-w-[180px]">{dept.deptName}</span>
                    <span className="text-gray-400 font-semibold">{dept.activeHeadcount} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: "#59ABBD" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}