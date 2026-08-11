function AdminOrderDetails({ order }) {
  const subtotal = order.items?.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  ) || 0;

  const total = Number(order.totalAmount);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order.id}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Order details
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Customer Information
        </h2>

        <div className="space-y-1">
          <p>
            <span className="font-medium">
              Name:
            </span>{" "}
            {order.user?.name}
          </p>

          <p>
            <span className="font-medium">
              Email:
            </span>{" "}
            {order.user?.email}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Order Items
        </h2>

        <div className="divide-y">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium">
                  {item.product?.name}
                </p>

                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">
                  ${Number(item.price).toFixed(2)}
                </p>

                <p className="text-sm text-gray-500">
                  Subtotal: $
                  {(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Order Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.shippingAddress
                ? "Included"
                : "N/A"}
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-3 font-semibold">
            Payment Status
          </h2>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              order.paymentStatus === "PAID"
                ? "bg-green-100 text-green-700"
                : order.paymentStatus === "FAILED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-3 font-semibold">
            Order Status
          </h2>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              order.status === "DELIVERED"
                ? "bg-green-100 text-green-700"
                : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;
