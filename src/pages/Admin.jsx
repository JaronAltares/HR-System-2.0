// src/pages/Admin.jsx
// FIX: was empty — no default export crashed the entire Vite module graph.

export default function Admin() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <h1
        className="text-3xl font-bold"
        style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        Admin Panel
      </h1>
      <p className="text-sm" style={{ color: "#4A6080" }}>
        Module Placeholder — User activation and rights management coming in Sprint 2.
      </p>
      <div
        className="border border-dashed border-gray-300 rounded-xl p-12 text-center"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <span className="text-sm tracking-wide uppercase font-medium" style={{ color: "#9FB3C8" }}>
          Admin Module — ADM_USER right required
        </span>
      </div>
    </div>
  );
}