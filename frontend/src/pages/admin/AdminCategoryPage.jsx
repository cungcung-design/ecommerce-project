import { useMemo, useState } from "react";
import { 
  Search, 
  Layers, 
  AlertCircle, 
  Loader2 
} from "lucide-react";

import AdminCategoryForm from "../../components/admin/AdminCategoryForm";
import AdminCategoryTable from "../../components/admin/AdminCategoryTable";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useDeleteAdminCategory,
  useUpdateAdminCategory,
  useUpdateAdminCategoryStatus,
} from "../../hooks/useAdminCategories";
import useNotification from "../../hooks/useNotification";
import { getFriendlyError } from "../../lib/getFriendlyError";

function AdminCategoryPage() {
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");
  const { notify, confirm } = useNotification();

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

  const handleSubmit = (payload) => {
    setError("");

    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, name: payload.name },
        {
          onSuccess: () => {
            setEditingCategory(null);
            notify.success("Category updated successfully");
          },
          onError: (err) =>
            setError(getFriendlyError(err, "Couldn't update this category.")),
        }
      );
    } else {
      createCategory.mutate(payload.name, {
          onSuccess: () => {
            notify.success("Category created successfully");
          },
        onError: (err) =>
          setError(getFriendlyError(err, "Couldn't create this category.")),
      });
    }
  };

  const handleToggleStatus = (category) => {
    setError("");
    const nextStatus = !category.isActive;
    confirm({
      title: "Confirm Status Change",
      message: `${nextStatus ? "Activate" : "Deactivate"} this category?`,
      confirmText: nextStatus ? "Activate" : "Deactivate",
      cancelText: "Cancel",
    }).then((confirmed) => {
      if (confirmed) {
        updateStatus.mutate({ id: category.id, isActive: nextStatus }, {
          onSuccess: () => {
            notify.success(`Category ${nextStatus ? "activated" : "deactivated"}`);
          },
          onError: (err) => setError(getFriendlyError(err, "Couldn't update category status")),
        });
      }
    });
  };

  const handleDelete = (category) => {
    setError("");
    confirm({
      title: "Delete Category",
      message: `Delete category "${category.name}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    }).then((confirmed) => {
      if (confirmed) {
        deleteCategory.mutate(category.id, {
          onSuccess: () => {
            notify.success(`Category "${category.name}" deleted`);
          },
          onError: (err) => setError(getFriendlyError(err, "Couldn't delete this category.")),
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Categories Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize and oversee your product classification tree.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <AdminCategoryForm
          initialData={editingCategory || {}}
          onSubmit={handleSubmit}
          isLoading={createCategory.isPending || updateCategory.isPending}
          submitLabel={editingCategory ? "Update Category" : "Create Category"}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-sm font-medium">Loading categories...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Failed to load categories. Please try again.</span>
        </div>
      )}

      {/* Table / Empty State Wrapper */}
      {!isLoading && !isError && (
        filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">No categories found</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              Try updating your search query or add a new category using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <AdminCategoryTable
              categories={filteredCategories}
              onEdit={setEditingCategory}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          </div>
        )
      )}
    </div>
  );
}

export default AdminCategoryPage;