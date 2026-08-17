import { useRemoveFromCart, useUpdateCartItem } from "../../hooks/useCart";
import useNotification from "../../hooks/useNotification";

function CartItem({ item }) {
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const { notify } = useNotification();

  const handleIncrease = () => {
    updateCartItem.mutate({
      productId: item.productId,
      quantity: item.quantity + 1,
    }, {
      onError: () => notify({ variant: "error", message: "Failed to update quantity" }),
    });
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateCartItem.mutate({
        productId: item.productId,
        quantity: item.quantity - 1,
      }, {
        onError: () => notify({ variant: "error", message: "Failed to update quantity" }),
      });
    }
  };

  const handleRemove = () => {
    removeFromCart.mutate(item.productId, {
      onSuccess: () => notify({ variant: "success", message: "Item removed from cart" }),
      onError: () => notify({ variant: "error", message: "Failed to remove item" }),
    });
  };

  const productImage = item.product?.imageUrl || item.product?.image || "";

  return (
    <div className="flex gap-4 rounded-xl border p-4">
      <div className="hidden sm:block w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {productImage ? (
          <img
            src={productImage}
            alt={item.product?.name || "Product image"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 gap-4">
        <div className="flex-1">
          <h2 className="font-semibold">{item.product?.name}</h2>
          <p className="mt-1 text-gray-600">${Number(item.product?.price).toFixed(2)}</p>

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
                item.quantity >= (item.product?.stock ?? 0)
              }
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            ${(Number(item.product?.price) * item.quantity).toFixed(2)}
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
    </div>
  );
}

export default CartItem;
