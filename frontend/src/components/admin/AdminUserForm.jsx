function AdminUserForm({ searchTerm, onSearchChange }) {
  return (
    <div className="w-full md:w-80">
      <label htmlFor="admin-user-search" className="mb-2 block text-sm font-medium text-slate-700">
        Search users
      </label>
      <input
        id="admin-user-search"
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name or email"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
      />
    </div>
  );
}

export default AdminUserForm;
