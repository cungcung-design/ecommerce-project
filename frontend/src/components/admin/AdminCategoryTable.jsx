function AdminCategoryTable({
  categories,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-3 text-slate-500 font-medium">Name</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Status</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Products</th>
            <th className="px-4 py-3 text-slate-500 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    category.isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-700">{category._count?.products ?? 0}</td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(category)}
                  className={`rounded px-3 py-1 text-sm ${
                    category.isActive ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {category.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategoryTable;
