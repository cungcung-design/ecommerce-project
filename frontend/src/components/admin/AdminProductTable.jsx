import { useState } from "react";
import { Link } from "react-router-dom";

import AdminStockStatus
  from "./AdminStockStatus";

import { useDeleteProduct, useUpdateProductStatus } from "../../hooks/useAdminProducts";
import useNotification from "../../hooks/useNotification";

function AdminProductTable({ products, pagination, page, setPage }) {
  const deleteProduct = useDeleteProduct();
  const toggleStatus = useUpdateProductStatus();
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { notify, confirm } = useNotification();

  const totalPages = pagination?.totalPages || 1;

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Product",
      message: "Delete this product permanently? This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    }).then((confirmed) => {
      if (!confirmed) {
        return;
      }

      setError(null);
      setDeletingId(id);

      deleteProduct.mutate(id, {
      onSuccess: () => {
        notify.success("Product deleted successfully");
      },
      onError: (err) => {
        setError(
          err?.response?.data?.message || "Failed to delete product. Please try again."
        );
        notify.error("Failed to delete product");
        setDeletingId(null);
      },
      });
    });
  };

  const handleToggleStatus = async (product) => {
    await toggleStatus.mutate({
      id: product.id,
      isActive: !product.isActive,
    }, {
      onSuccess: () => {
        notify.success(`Product ${!product.isActive ? "activated" : "deactivated"} successfully`);
      },
      onError: () => notify.error("Failed to update product status"),
    });
  };

  if (products.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="px-6 py-8 text-center text-sm text-slate-500">
          No products found.
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="shrink-0 text-red-500 hover:text-red-400"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-slate-500">Image</th>
              <th className="px-6 py-4 text-left text-sm text-slate-500">Product</th>
              <th className="px-6 py-4 text-left text-sm text-slate-500">Category</th>
              <th className="px-6 py-4 text-left text-sm text-slate-500">Price</th>
              <th className="px-6 py-4 text-left text-sm text-slate-500">Stock</th>
              <th className="px-6 py-4 text-left text-sm text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-sm text-slate-500">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                      No img
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-slate-900">{product.name}</td>

                <td className="px-6 py-4 text-slate-500">
                  {product.category?.name}
                </td>

                <td className="px-6 py-4 text-slate-900">${product.price}</td>

                <td className="px-6 py-4">
                  <AdminStockStatus
                    stock={product.stock}
                  />
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs border ${
                      product.isActive
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="mr-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(product)}
                    disabled={toggleStatus.isPending}
                    className="mr-3 text-sm font-medium text-amber-600 hover:text-amber-500 disabled:opacity-40"
                  >
                    {product.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="text-sm font-medium text-red-600 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-slate-500">
            Page {pagination?.page || page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default AdminProductTable;