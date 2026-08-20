import { useRemoveFromCart, useUpdateCartItem } from "../../hooks/useCart";
import useNotification from "../../hooks/useNotification";
import { getFriendlyError } from "../../lib/getFriendlyError";

function CartItem({ item }) {
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const { notify } = useNotification();

  const handleIncrease = () => {
    updateCartItem.mutate({
      productId: item.productId,
      quantity: item.quantity + 1,
    }, {
      onError: (err) => notify.error(getFriendlyError(err, "Couldn't update quantity.")),
    });
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateCartItem.mutate({
        productId: item.productId,
        quantity: item.quantity - 1,
      }, {
        onError: (err) => notify.error(getFriendlyError(err, "Couldn't update quantity.")),
      });
    }
  };

  const handleRemove = () => {
    removeFromCart.mutate(item.productId, {
      onError: (err) => notify.error(getFriendlyError(err, "Couldn't remove this item.")),
    });
  };

  const productImage = item.product?.imageUrl || item.product?.image || "";

  return (
    <div className="flex gap-3 sm:gap-4 rounded-xl border border-slate-200 p-3 sm:p-5 items-center">
      {/* Product Image */}
      <div className="block w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
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

      {/* Right Content Section - Aligned Horizontally */}
      <div className="flex flex-row flex-1 justify-between items-center gap-3">
        {/* Left Side Details: Title, Price, Quantity controls */}
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-xs sm:text-base truncate">{item.product?.name}</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-600 font-medium">${Number(item.product?.price).toFixed(2)}</p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleDecrease}
              disabled={updateCartItem.isPending || removeFromCart.isPending}
              className="rounded border px-2 py-0.5 text-xs sm:text-sm disabled:opacity-40 cursor-pointer"
            >
              -
            </button>

            <span className="text-xs sm:text-sm font-medium">{item.quantity}</span>

            <button
              onClick={handleIncrease}
              disabled={
                updateCartItem.isPending ||
                removeFromCart.isPending ||
                item.quantity >= (item.product?.stock ?? 0)
              }
              className="rounded border px-2 py-0.5 text-xs sm:text-sm disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Right Side Details: Total Price & Remove Option */}
        <div className="text-right flex flex-col items-end justify-between self-stretch py-0.5">
          <p className="font-semibold text-xs sm:text-base">
            ${(Number(item.product?.price) * item.quantity).toFixed(2)}
          </p>

          <button
            onClick={handleRemove}
            disabled={updateCartItem.isPending || removeFromCart.isPending}
            className="text-[11px] sm:text-sm text-red-600 hover:text-red-700 disabled:opacity-40 cursor-pointer"
          >
            {removeFromCart.isPending ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;