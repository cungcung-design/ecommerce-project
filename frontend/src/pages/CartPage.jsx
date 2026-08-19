import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useCart } from "../hooks/useCart";
import useNotification from "../hooks/useNotification";

import CartItem from "../components/cart/CartItem";

import CartSummary from "../components/cart/CartSummary";

function CartPage() {
  const {
    data: cart,
    isLoading,
    isError,
  } = useCart();
  const { notify } = useNotification();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin" />
        </div>
        <p className="text-slate-500 font-medium text-lg animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-lg mx-auto mt-12 p-8 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-3 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-rose-900 text-xl">Unable to load cart</h3>
        <p className="text-base text-rose-600">
          Something went wrong while fetching your cart. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-lg bg-rose-600 px-4 py-2 text-base font-medium text-white hover:bg-rose-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h1>
        <p className="mt-3 text-lg text-gray-600">Add some products to your cart.</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-slate-900 hover:bg-orange-600 px-6 py-3 text-base font-semibold text-white transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
        <span className="text-base text-slate-500">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          itemCount={itemCount}
        />
      </div>
    </div>
  );
}

export default CartPage;
