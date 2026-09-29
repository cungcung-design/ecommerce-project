import { Link, useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { SHOP_PATH } from "../../lib/authRedirect";

function CartSummary({ subtotal, shipping, total, itemCount }) {
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth();

  const handleProceedToCheckout = () => {
    if (!requireAuth("/checkout")) return;
    navigate("/checkout");
  };
  return (
    <div className="h-fit w-full min-w-0 rounded-xl border border-slate-200 p-5 sm:p-6">
      <h2 className="text-xl font-medium text-slate-900">Order Summary</h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-base">
          <span className="text-slate-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="text-slate-600">Shipping</span>
          <span className="font-medium text-slate-900">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between text-xl font-semibold text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex w-full min-w-0 items-stretch gap-3">
        <Link
          to={SHOP_PATH}
          className="inline-flex min-h-10 min-w-0 flex-1 basis-0 items-center justify-center rounded-lg border border-slate-300 px-3 text-center text-sm font-semibold leading-tight text-slate-800 transition-colors hover:border-slate-900 hover:text-slate-900"
        >
          Continue Shopping
        </Link>
        <button
          type="button"
          onClick={handleProceedToCheckout}
          className="inline-flex min-h-10 min-w-0 flex-1 basis-0 items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-3 text-center text-sm font-semibold leading-tight text-white transition-colors hover:border-orange-600 hover:bg-orange-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
