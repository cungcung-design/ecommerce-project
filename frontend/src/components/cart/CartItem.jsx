import { useRemoveFromCart, useUpdateCartItem } from "../../hooks/useCart";

function CartItem({ item }) {
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();

  const handleIncrease = () => {
    updateCartItem.mutate({
      productId: item.productId,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateCartItem.mutate({
        productId: item.productId,
        quantity: item.quantity - 1,
      });
    }
  };

  const handleRemove = () => {
    removeFromCart.mutate(item.productId);
  };

  return (
    <div className="flex gap-4 rounded-xl border p-4">
      <div className="flex-1">
        <h2 className="font-semibold">{item.product.name}</h2>
        <p className="mt-1 text-gray-600">${item.product.price}</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleDecrease}
            disabled={updateCartItem.isPending || removeFromCart.isPending}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={handleIncrease}
            disabled={
              updateCartItem.isPending ||
              removeFromCart.isPending ||
              item.quantity >= item.product.stock
            }
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">
          ${(Number(item.product.price) * item.quantity).toFixed(2)}
        </p>

        <button
          onClick={handleRemove}
          disabled={updateCartItem.isPending || removeFromCart.isPending}
          className="mt-4 text-sm text-red-600 disabled:opacity-40"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
