function AdminUserForm({ searchTerm, onSearchChange }) {
  return (
    <div className="w-full md:w-80">
      <label htmlFor="admin-user-search" className="mb-2 block text-sm font-medium text-gray-700">
        Search users
      </label>
      <input
        id="admin-user-search"
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name or email"
        className="w-full rounded-lg border px-3 py-2"
      />
    </div>
  );
}

export default AdminUserForm;
