import { Link } from "react-router-dom";

import { useOrders } from "../hooks/useOrders";

function Orders() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useOrders();

  if (isLoading) {
    return (
      <div className="p-8">
        Loading orders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        Failed to load orders.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-gray-600">
          You have no orders yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-xl border p-5 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">
                    Order #{order.id}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ${order.totalAmount}
                  </p>

                  <p className="mt-1 text-sm">
                    {order.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
