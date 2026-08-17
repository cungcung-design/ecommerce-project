import { paymentMethodLabels } from "../../validators/paymentValidator";

function CheckoutSummary({ items, subtotal, shipping, total, paymentMethod }) {
  const methodLabel = paymentMethod
    ? (paymentMethodLabels[paymentMethod] ?? paymentMethod)
    : null;

  return (
    <div className="h-fit rounded-xl border bg-white p-5">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {methodLabel && (
        <p className="mt-0.5 text-xs text-gray-600">
          Payment:{" "}
          <span className="font-medium">{methodLabel}</span>
        </p>
      )}

      <div className="mt-4 space-y-3">
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

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;
