import { useEffect } from "react";
import { Link } from "react-router-dom";
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
      <div className="p-8">
        Loading cart...
      </div>
    );
  }

  if (isError) {
    notify.error("Failed to load cart.");
    return (
      <div className="p-8">
        Failed to load cart.
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-3 text-gray-600">Add some products to your cart.</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white">
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
    <div>
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
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
