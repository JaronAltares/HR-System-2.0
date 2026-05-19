// src/pages/Departments.jsx
// M1 – Sprint 1 Placeholder
// UI ONLY — Structure placeholder for routing compliance.

export default function Departments() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Page Heading using DM Serif Display as per design token */}
      <h1 
        className="text-3xl font-bold" 
        style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        Departments
      </h1>
      
      <p className="text-sm" style={{ color: "#4A6080" }}>
        Module Placeholder — Core layout and data wiring will be implemented in Sprint 2.
      </p>

      {/* Simple UI Placeholder card mapping to the surface design token */}
      <div 
        className="border border-dashed border-gray-300 rounded-xl p-12 text-center"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <span className="text-sm tracking-wide uppercase font-medium" style={{ color: "#9FB3C8" }}>
          Department Management System
        </span>
      </div>
    </div>
  );
}