import { Link, useParams } from "react-router-dom";

import { useAdminOrder } from "../../hooks/useAdminOrder";

import AdminOrderDetails
  from "../../components/admin/AdminOrderDetails";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useAdminOrder(id);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-gray-600">
          Loading order...
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        Order not found.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order.id}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Order details
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Back to Orders
        </Link>
      </div>

      <AdminOrderDetails order={order} />
    </div>
  );
}
