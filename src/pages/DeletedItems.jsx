function DeletedItems() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Deleted Items</h1>
      <div className="bg-white rounded-xl shadow p-12 text-center border border-red-100">
        <div className="text-6xl mb-6">🗑️</div>
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Soft Deleted Records</h2>
        <p className="text-gray-500">Recover or permanently manage soft-deleted records.</p>
        <div className="mt-6 text-sm text-red-500 font-medium">(Admin / Superadmin Only)</div>
      </div>
    </div>
  );
}

export default DeletedItems;   // ← This line must exist