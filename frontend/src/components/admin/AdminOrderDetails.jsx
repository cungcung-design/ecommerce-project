import OrderStatus from "../../components/orders/OrderStatus";
import AdminOrderStatus from "./AdminOrderStatus";
import PaymentStatusBadge from "../payments/PaymentStatusBadge";
import { paymentStatusDescription } from "../../validators/paymentValidator";

function AdminOrderDetails({ order }) {
  const itemsSubtotal = order.items?.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  ) || 0;

  const total = Number(order.totalAmount);

  return (
    <div className="space-y-6">
      {/* Customer Info + Order Summary - responsive */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Customer Information
          </h2>

          <div className="space-y-1 text-sm">
            <p className="font-medium text-slate-900">
              {order.user?.name || "N/A"}
            </p>

            <p className="text-slate-600">
              {order.user?.email || "N/A"}
            </p>
          </div>

          <div className="mt-4 space-y-1 text-sm">
            <p>
              <span className="font-medium text-slate-700">
                Order ID:
              </span>{" "}
              #{order.id}
            </p>

            <p>
              <span className="font-medium text-slate-700">
                Date:
              </span>{" "}
              {new Date(order.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </p>

            <p>
              <span className="font-medium text-slate-700">
                Payment:
              </span>{" "}
              {order.paymentStatus || "PENDING"}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-slate-900">${itemsSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span className="text-slate-900">
                ${(total - itemsSubtotal).toFixed(2)}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        <div className="mt-4">
            <OrderStatus status={order.status} />
          </div>
        </div>
       </div>

      {/* Payment Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Payment Information
        </h2>

        <div className="mb-4">
          <PaymentStatusBadge
            method={order.paymentMethod || "COD"}
            status={order.paymentStatus || "PENDING"}
          />
        </div>

        <p className="mb-3 text-sm text-slate-600">
          {paymentStatusDescription[order.paymentStatus || "PENDING"]}
        </p>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium text-slate-700">
              Total Amount:
            </span>{" "}
            ${Number(order.totalAmount).toFixed(2)}
          </p>

          {order.paymentReference && (
            <p>
              <span className="font-medium text-slate-700">
                Reference:
              </span>{" "}
              <span className="break-all text-slate-600">
                {order.paymentReference}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Shipping Address
        </h2>

        <div className="space-y-1 text-sm">
          <p className="font-medium text-slate-900">
            {order.shippingName}
          </p>

          <p className="text-slate-600">{order.shippingAddress}</p>

          <p className="text-slate-600">
            {order.shippingCity},{" "}
            {order.shippingCountry}
          </p>

          <p className="text-slate-600">Phone: {order.shippingPhone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Order Items
        </h2>

        <div className="divide-y divide-slate-200">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  {item.product?.name || "Product"}
                </p>

                <p className="text-sm text-slate-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium text-slate-900">
                  ${Number(item.price).toFixed(2)}
                </p>

                <p className="text-sm text-slate-500">
                  Subtotal: $
                  {(
                    Number(item.price) * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update */}
      <AdminOrderStatus
        orderId={order.id}
        currentStatus={order.status}
      />
    </div>
  );
}

export default AdminOrderDetails;
