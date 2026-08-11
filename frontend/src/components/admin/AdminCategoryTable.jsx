function AdminCategoryTable({
  categories,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t">
              <td className="px-4 py-3 font-medium">{category.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    category.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">{category._count?.products ?? 0}</td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(category)}
                  className={`rounded px-3 py-1 text-sm ${
                    category.isActive ? "bg-red-600 text-white" : "bg-green-600 text-white"
                  }`}
                >
                  {category.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="rounded border px-3 py-1 text-sm"
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
