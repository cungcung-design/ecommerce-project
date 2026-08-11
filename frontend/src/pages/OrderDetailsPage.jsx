import { Link, useParams } from "react-router-dom";

import { useOrder, useCancelOrder } from "../hooks/useOrders";
import { useOrderPayment } from "../hooks/usePayment";

import OrderStatus from "../components/orders/OrderStatus";
import PaymentStatusBadge from "../components/payments/PaymentStatusBadge";
import { paymentStatusDescription } from "../validators/paymentValidator";

function OrderDetailsPage() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useOrder(id);

  const {
    data: payment,
    isLoading: paymentLoading,
    isError: paymentError,
  } = useOrderPayment(id, {
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const method = query.state.data?.method;
      return method === "ONLINE" && status === "PENDING" ? 5000 : false;
    },
  });

  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-gray-600">Order not found.</p>
      </div>
    );
  }

  const itemsSubtotal = order.items?.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  ) || 0;

  const total = Number(order.totalAmount);

  const canCancel = order.status === "PENDING";

  const formattedDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header - responsive */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Order #{order.id}
        </h1>

        <OrderStatus status={order.status} />
      </div>

      <p className="mb-6 text-sm text-gray-500">
        {formattedDate}
      </p>

      {/* Error from cancel mutation */}
      {cancelOrder.isError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {cancelOrder.error?.response?.data?.message ||
            cancelOrder.error?.message ||
            "Failed to cancel order"}
        </div>
      )}

      {/* Desktop: two column | Mobile: stacked */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Products */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">
            Products
          </h2>

          <div className="divide-y rounded-xl border">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-4 px-4"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {item.product?.name || "Product"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="text-right font-medium">
                  $
                  {(Number(item.price) * item.quantity).toFixed(
                    2
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ${itemsSubtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  ${(total - itemsSubtotal).toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

           {/* Cancel button for PENDING orders */}
          {canCancel && (
            <button
              onClick={() => cancelOrder.mutate(order.id)}
              disabled={cancelOrder.isPending}
              className="mt-6 w-full rounded-lg border border-red-600 px-6 py-3 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelOrder.isPending
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}

          {/* Payment Information */}
          <div className="mt-6 rounded-xl border bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Payment Information
            </h2>

            {paymentLoading ? (
              <p className="text-sm text-gray-500">
                Loading payment details...
              </p>
            ) : paymentError ? (
              <PaymentStatusBadge
                method={order.paymentMethod || "COD"}
                status={order.paymentStatus || "PENDING"}
              />
            ) : (
              <>
                <PaymentStatusBadge
                  method={payment.method}
                  status={payment.status}
                />

                <p className="mt-3 text-sm text-gray-600">
                  {paymentStatusDescription[payment.status]}
                </p>

                {payment.transactionId && (
                  <p className="mt-2 text-xs text-gray-500 break-all">
                    Transaction: {payment.transactionId}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address - below on all screens */}
      <div className="mt-8 rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Shipping Address
        </h2>

        <div className="grid gap-1 text-sm">
          <p className="font-medium">
            {order.shippingName}
          </p>

          <p>{order.shippingAddress}</p>

          <p>
            {order.shippingCity},{" "}
            {order.shippingCountry}
          </p>

          <p>Phone: {order.shippingPhone}</p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/orders"
          className="rounded-lg border px-6 py-3 text-sm"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
