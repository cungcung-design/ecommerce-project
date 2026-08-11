import { Link } from "react-router-dom";

function AdminOrderTable({
  orders,
  pagination,
  page,
  setPage,
}) {
  const totalPages = pagination?.totalPages || 1;

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border bg-white">
        <div className="px-6 py-8 text-center text-sm text-gray-500">
          No orders found.
        </div>
      </div>
    );
  }

  const statusLabel = (status) => {
    const labels = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      PROCESSING: "Processing",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };

    return labels[status] ?? status;
  };

  const statusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-orange-100 text-orange-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-indigo-100 text-indigo-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };

    return colors[status] ?? "bg-gray-100 text-gray-800";
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border bg-white sm:block">
        <table className="w-full min-w-[700px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Order
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Total
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Date
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <span className="font-medium">
                    #{order.id}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">
                      {order.user?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.user?.email || "N/A"}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3">
                  ${Number(order.totalAmount).toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}
                  >
                    {statusLabel(order.status)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 sm:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">
                  Order #{order.id}
                </h3>

                <p className="text-sm text-gray-500">
                  {order.user?.name || "N/A"}
                </p>

                <p className="text-sm text-gray-400">
                  {order.user?.email || "N/A"}
                </p>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}
              >
                {statusLabel(order.status)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="font-semibold">
                ${Number(order.totalAmount).toFixed(2)}
              </p>

              <Link
                to={`/admin/orders/${order.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
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

export default AdminOrderTable;
