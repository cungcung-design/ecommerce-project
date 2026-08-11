import { Link } from "react-router-dom";

function CartSummary({ subtotal, shipping, total, itemCount }) {
  return (
    <div className="h-fit rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} items)</span>
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

      <Link
        to="/checkout"
        className="mt-6 block w-full rounded-lg bg-black px-6 py-3 text-center text-white"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default CartSummary;
