import { Link } from "react-router-dom";

export default function AdminRecentOrders({
  orders = [],
}) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Orders
        </h2>

        <Link
          to="/admin/orders"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-6"
          >
            <div>
              <p className="font-medium text-slate-900">
                Order #{order.id}
              </p>

              <p className="text-sm text-slate-500">
                {order.user?.name}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium text-slate-900">
                ${order.totalAmount}
              </p>

              <p className="text-sm text-slate-500">
                {order.status}
              </p>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}