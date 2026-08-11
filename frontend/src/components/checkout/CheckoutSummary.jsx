import { paymentMethodLabels } from "../../validators/paymentValidator";

function CheckoutSummary({ items, subtotal, shipping, total, paymentMethod }) {
  const methodLabel = paymentMethod
    ? (paymentMethodLabels[paymentMethod] ?? paymentMethod)
    : null;

  return (
    <div className="h-fit rounded-xl border bg-white p-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      {methodLabel && (
        <p className="mt-1 text-sm text-gray-600">
          Payment:{" "}
          <span className="font-medium">{methodLabel}</span>
        </p>
      )}

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-sm"
          >
            <div>
              <p className="font-medium">
                {item.product.name}
              </p>

              <p className="text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="font-medium">
              $
              {(Number(item.product.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;
