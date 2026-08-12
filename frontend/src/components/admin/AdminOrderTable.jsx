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
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="px-6 py-8 text-center text-sm text-slate-500">
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
      PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      CONFIRMED: "bg-orange-50 text-orange-700 border border-orange-200",
      PROCESSING: "bg-blue-50 text-blue-700 border border-blue-200",
      SHIPPED: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      DELIVERED: "bg-green-50 text-green-700 border border-green-200",
      CANCELLED: "bg-red-50 text-red-700 border border-red-200",
    };

    return colors[status] ?? "bg-slate-100 text-slate-700 border border-slate-200";
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white sm:block">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Order
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Total
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Date
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">
                    #{order.id}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.user?.name || "N/A"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {order.user?.email || "N/A"}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 text-slate-900">
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
                  <span className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
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
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Order #{order.id}
                </h3>

                <p className="text-sm text-slate-500">
                  {order.user?.name || "N/A"}
                </p>

                <p className="text-sm text-slate-400">
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
              <p className="font-semibold text-slate-900">
                ${Number(order.totalAmount).toFixed(2)}
              </p>

              <Link
                to={`/admin/orders/${order.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
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
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-slate-500">
            Page {pagination?.page || page} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default AdminOrderTable;
