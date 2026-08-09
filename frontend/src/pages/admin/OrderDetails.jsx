import { useParams, Link } from "react-router-dom";

import { useAdminOrder } from "../../hooks/useAdminOrder";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";

function OrderDetails() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useAdminOrder(id);

  const updateStatus = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8">
        Order not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Order #{order.id}
        </h1>

        <Link
          to="/admin/orders"
          className="rounded-lg border px-4 py-2"
        >
          Back to Orders
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold">
            Items
          </h2>

          <div className="mt-4 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.product.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Order Info
          </h2>

          <div className="mt-4 rounded-xl border p-6">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Status
              </span>

              <select
                value={order.status}
                onChange={(event) =>
                  updateStatus.mutate({
                    id: order.id,
                    status: event.target.value,
                  })
                }
                className="rounded-lg border p-2"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="PROCESSING">
                  Processing
                </option>

                <option value="SHIPPED">
                  Shipped
                </option>

                <option value="DELIVERED">
                  Delivered
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="text-gray-600">
                Total
              </span>

              <span className="font-semibold">
                ${order.totalAmount}
              </span>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold">
                Shipping Address
              </h3>

              <p className="mt-2 text-gray-600">
                {order.shippingName}
              </p>

              <p className="text-gray-600">
                {order.shippingPhone}
              </p>

              <p className="text-gray-600">
                {order.shippingAddress}
              </p>

              <p className="text-gray-600">
                {order.shippingCity}, {order.shippingCountry}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
