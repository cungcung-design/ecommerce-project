import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { isRemovalInFlight, useCart, useRemoveFromCart } from "../hooks/useCart";
import { SHOP_PATH } from "../lib/authRedirect";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

function CartPage() {
  const queryClient = useQueryClient();
  const removeFromCart = useRemoveFromCart();
  const {
    data: cart,
    isLoading,
    isError,
    refetch,
  } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleRemove = (item) => {
    if (isRemovalInFlight(item.productId)) return;
    removeFromCart.mutate(item.productId);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-4" aria-busy="true" aria-label="Loading cart">
        <div className="skeleton-shimmer h-8 w-48 rounded bg-slate-200" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="skeleton-shimmer h-28 rounded-xl bg-slate-200" />
            <div className="skeleton-shimmer h-28 rounded-xl bg-slate-200" />
          </div>
          <div className="skeleton-shimmer h-56 rounded-xl bg-slate-200" />
        </div>
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
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            refetch();
          }}
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
        <h1 className="text-2xl font-medium text-slate-900 font-serif">Your Cart is Empty</h1>
        <p className="mt-3 text-lg text-gray-600">Add some products to your cart.</p>
        <Link to={SHOP_PATH} className="mt-6 inline-block rounded-lg bg-slate-900 hover:bg-orange-600 px-6 py-3 text-base font-semibold text-white transition-colors">
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
        <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight font-serif">Shopping Cart</h1>
        <span className="text-base text-slate-500">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
      </div>

      <div className="grid min-w-0 gap-8 lg:grid-cols-3 lg:items-start">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              isRemoving={removeFromCart.isPending && Number(removeFromCart.variables) === Number(item.productId)}
            />
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
