import { Link } from "react-router-dom";

import { Package } from "lucide-react";

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

  const firstItem = order.items?.[0];
  const extraItemsCount = order.items?.length - 1;
  const firstImage = firstItem?.product?.imageUrl || firstItem?.product?.image;

  return (
    <div className="rounded-xl border bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {firstImage ? (
            <img
              src={firstImage}
              alt={firstItem?.product?.name || "Product"}
              className="h-14 w-14 shrink-0 rounded-lg object-cover border border-gray-100"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400">
              <Package className="h-6 w-6" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-medium">
                 Order {order.id}
              </h2>
              <OrderStatus status={order.status} />
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {formattedDate}
            </p>

            {firstItem && (
              <p className="mt-1.5 text-sm text-gray-600">
                {firstItem.product?.name || "Product"} × {firstItem.quantity}
                {extraItemsCount > 0 && (
                  <span className="text-gray-400">
                    {" "}
                    +{extraItemsCount} more
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:text-right">
          <div>
            <p className="text-lg font-semibold">
              ${total}
            </p>
          </div>
          <Link
            to={`/orders/${order.id}`}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
