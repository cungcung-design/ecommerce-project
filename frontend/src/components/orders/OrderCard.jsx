import { Link } from "react-router-dom";

import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const total = Number(order.totalAmount).toFixed(2);

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block rounded-xl border bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Order #{order.id}</h2>
          <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <OrderStatus status={order.status} />

          <p className="font-semibold">${total}</p>
        </div>
      </div>
    </Link>
  );
}

export default OrderCard;
