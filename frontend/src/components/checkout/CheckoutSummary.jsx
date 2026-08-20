import { paymentMethodLabels } from "../../validators/paymentValidator";

function CheckoutSummary({ items, subtotal, shipping, total, paymentMethod }) {
  const methodLabel = paymentMethod
    ? (paymentMethodLabels[paymentMethod] ?? paymentMethod)
    : null;

  return (
    <div className="h-fit space-y-5">
      <div>
        <h2 className="text-lg font-medium text-slate-900 tracking-tight">Order Summary</h2>
        {methodLabel && (
          <p className="mt-1 text-sm text-slate-500">
            Payment: <span className="font-medium text-slate-800">{methodLabel}</span>
          </p>
        )}
      </div>

      {/* Items List */}
      <div className="max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center pt-3 first:pt-0 text-sm"
          >
            <div className="space-y-0.5">
              <p className="font-medium text-slate-900">
                {item.product.name}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="font-medium text-slate-900">
              ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Financial Calculations */}
      <div className="space-y-2 pt-3 border-t border-slate-200">
        <div className="flex justify-between text-sm text-slate-600 font-medium">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm text-slate-600 font-medium">
          <span>Shipping</span>
          <span className="font-medium text-slate-900">
            {shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-3 mt-1">
          <div className="flex justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;