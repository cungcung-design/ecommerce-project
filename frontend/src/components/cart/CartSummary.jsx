import { Link } from "react-router-dom";

function CartSummary({ subtotal, shipping, total, itemCount }) {
  return (
    <div className="h-fit rounded-xl border border-slate-200 p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Shipping</span>
          <span className="font-medium text-slate-900">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-5 block w-full rounded-lg bg-slate-900 hover:bg-orange-600 px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default CartSummary;
