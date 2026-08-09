import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

function Cart() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

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

  return (
    <div>
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-xl border p-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              )}

              <div className="flex flex-1 justify-between">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="mt-1">${item.price}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => decreaseQuantity(item.id)} className="rounded border px-3 py-1">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} disabled={item.quantity >= item.stock} className="rounded border px-3 py-1 disabled:opacity-40">+</button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="mt-4 text-sm text-red-600">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="mt-6 flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="mt-3 flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-black px-6 py-3 text-center text-white"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
