import { useMemo, useState } from "react";

import AdminCategoryForm from "../../components/admin/AdminCategoryForm";
import AdminCategoryTable from "../../components/admin/AdminCategoryTable";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useDeleteAdminCategory,
  useUpdateAdminCategory,
  useUpdateAdminCategoryStatus,
} from "../../hooks/useAdminCategories";

function AdminCategoryPage() {
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const { data: categories = [], isLoading, isError } = useAdminCategories();
  const createCategory = useCreateAdminCategory();
  const updateCategory = useUpdateAdminCategory();
  const updateStatus = useUpdateAdminCategoryStatus();
  const deleteCategory = useDeleteAdminCategory();

  const filteredCategories = useMemo(() => {
    const term = search.toLowerCase();

    return categories.filter((category) => {
      return category.name.toLowerCase().includes(term);
    });
  }, [categories, search]);

  const handleSubmit = async (payload) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, name: payload.name });
      setEditingCategory(null);
      return;
    }

    await createCategory.mutateAsync(payload.name);
  };

  const handleToggleStatus = async (category) => {
    const nextStatus = !category.isActive;
    const confirmed = window.confirm(`${nextStatus ? "Activate" : "Deactivate"} this category?`);

    if (!confirmed) return;

    await updateStatus.mutateAsync({ id: category.id, isActive: nextStatus });
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(`Delete category "${category.name}"?`);

    if (!confirmed) return;

    await deleteCategory.mutateAsync(category.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product categories</p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories"
          className="rounded-lg border px-3 py-2 md:w-80"
        />
      </div>

      <AdminCategoryForm
        initialData={editingCategory || {}}
        onSubmit={handleSubmit}
        isLoading={createCategory.isPending || updateCategory.isPending}
        submitLabel={editingCategory ? "Update Category" : "Create Category"}
      />

      {isLoading && <div className="rounded-lg bg-white p-6">Loading categories...</div>}

      {isError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">Failed to load categories.</div>
      )}

      {!isLoading && !isError && (
        <AdminCategoryTable
          categories={filteredCategories}
          onEdit={setEditingCategory}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default AdminCategoryPage;
