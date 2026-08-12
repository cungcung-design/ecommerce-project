function AdminUserTable({
  users,
  currentUserId,
  onStatusToggle,
  onRoleChange,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-3 text-slate-500 font-medium">Name</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Email</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Role</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Status</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Orders</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Joined</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
              <td className="px-4 py-3 text-slate-700">{user.email}</td>
              <td className="px-4 py-3">
                <select
                  value={user.role}
                  onChange={(event) => onRoleChange(user, event.target.value)}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-900"
                  disabled={user.id === currentUserId}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium border ${
                    user.isActive
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-700">{user._count?.orders ?? 0}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onStatusToggle(user)}
                  className={`rounded px-3 py-1 text-sm ${
                    user.isActive ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                  disabled={user.id === currentUserId}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserTable;
