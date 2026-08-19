import { useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../hooks/useRequireAuth";

function CartSummary({ subtotal, shipping, total, itemCount }) {
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth("checkout");

  const handleProceedToCheckout = () => {
    if (!requireAuth("/checkout")) return;
    navigate("/checkout");
  };
  return (
    <div className="h-fit rounded-xl border border-slate-200 p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>

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

      <button
        type="button"
        onClick={handleProceedToCheckout}
        className="mt-6 block w-full rounded-lg bg-slate-900 hover:bg-orange-600 px-6 py-3 text-center text-base font-semibold text-white transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default CartSummary;
