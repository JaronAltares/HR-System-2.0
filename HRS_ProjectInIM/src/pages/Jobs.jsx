import AppShell from "../layouts/AppShell";

export default function Jobs() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Jobs</h2>
          <p className="text-sm text-gray-500 mt-1">Browse and manage job positions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">💼</div>
          <p className="text-gray-400 text-sm">Jobs list coming in Sprint 2</p>
        </div>
      </div>
    </AppShell>
  );
}