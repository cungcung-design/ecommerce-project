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
      <div className="p-8">
        Loading order...
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
      <div className="mb-6 flex items-center justify-between">
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
          className="rounded-lg border px-4 py-2"
        >
          Back to Orders
        </Link>
      </div>

      <AdminOrderDetails order={order} />
    </div>
  );
}
