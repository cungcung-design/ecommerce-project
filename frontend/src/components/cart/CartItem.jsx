import { useUpdateCartItem } from "../../hooks/useCart";

function CartItem({ item, onRemove, isRemoving = false }) {
  const updateCartItem = useUpdateCartItem();

  const handleIncrease = () => {
    if (updateCartItem.isPending || isRemoving) return;
    updateCartItem.mutate({
      productId: item.productId,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrease = () => {
    if (updateCartItem.isPending || isRemoving) return;
    if (item.quantity > 1) {
      updateCartItem.mutate({
        productId: item.productId,
        quantity: item.quantity - 1,
      });
    }
  };

  const handleRemove = () => {
    if (updateCartItem.isPending || isRemoving) return;
    onRemove(item);
  };

  const productImage = item.product?.imageUrl || item.product?.image || "";

  return (
    <div className="flex w-full min-w-0 max-w-full items-center gap-3 rounded-xl border border-slate-200 p-3 sm:gap-4 sm:p-5">
      <div className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
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

      <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-medium text-xs sm:text-base truncate">{item.product?.name}</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-600 font-medium">${Number(item.product?.price).toFixed(2)}</p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={updateCartItem.isPending || isRemoving}
              className="rounded border px-2 py-0.5 text-xs sm:text-sm disabled:opacity-40 cursor-pointer"
            >
              -
            </button>

            <span className="text-xs sm:text-sm font-medium">{item.quantity}</span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={
                updateCartItem.isPending ||
                isRemoving ||
                item.quantity >= (item.product?.stock ?? 0)
              }
              className="rounded border px-2 py-0.5 text-xs sm:text-sm disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between self-stretch py-0.5 text-right">
          <p className="font-semibold text-xs sm:text-base">
            ${(Number(item.product?.price) * item.quantity).toFixed(2)}
          </p>

          <button
            type="button"
            onClick={handleRemove}
            disabled={updateCartItem.isPending || isRemoving}
            className="inline-flex min-h-9 shrink-0 items-center text-[11px] text-red-600 hover:text-red-700 disabled:opacity-40 cursor-pointer touch-manipulation sm:text-sm"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
