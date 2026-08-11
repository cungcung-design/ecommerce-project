import { Link } from "react-router-dom";

import AdminStockStatus
  from "./AdminStockStatus";

import { useDeleteProduct, useUpdateProductStatus } from "../../hooks/useAdminProducts";

function AdminProductTable({ products, pagination, page, setPage }) {
  const deleteProduct = useDeleteProduct();
  const toggleStatus = useUpdateProductStatus();

  const totalPages = pagination?.totalPages || 1;

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");

    if (confirmed) {
      await deleteProduct.mutate(id);
    }
  };

  const handleToggleStatus = async (product) => {
    await toggleStatus.mutate({
      id: product.id,
      isActive: !product.isActive,
    });
  };

  if (products.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          No products found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm">Image</th>
              <th className="px-6 py-4 text-left text-sm">Product</th>
              <th className="px-6 py-4 text-left text-sm">Category</th>
              <th className="px-6 py-4 text-left text-sm">Price</th>
              <th className="px-6 py-4 text-left text-sm">Stock</th>
              <th className="px-6 py-4 text-left text-sm">Status</th>
              <th className="px-6 py-4 text-right text-sm">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      No img
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">{product.name}</td>

                <td className="px-6 py-4">
                  {product.category?.name}
                </td>

                <td className="px-6 py-4">${product.price}</td>

                <td className="px-6 py-4">
                  <AdminStockStatus
                    stock={product.stock}
                  />
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="mr-3 text-sm font-medium"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(product)}
                    disabled={toggleStatus.isPending}
                    className="mr-3 text-sm font-medium disabled:opacity-40"
                  >
                    {product.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-sm font-medium text-red-600"
                  >
                    Delete
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
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {pagination?.page || page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default AdminProductTable;
