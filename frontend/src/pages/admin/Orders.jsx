import { Link } from "react-router-dom";

import { useAdminOrders } from "../../hooks/useAdminOrders";

function Orders() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useAdminOrders();

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
        Orders
      </h1>

      <div className="mt-8 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4">
                Order
              </th>

              <th className="p-4">
                Customer
              </th>

              <th className="p-4">
                Total
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b"
              >
                <td className="p-4">
                  #{order.id}
                </td>

                <td className="p-4">
                  <div>
                    {order.user.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {order.user.email}
                  </div>
                </td>

                <td className="p-4">
                  ${order.totalAmount}
                </td>

                <td className="p-4">
                  {order.status}
                </td>

                <td className="p-4">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
