import { useState } from "react";
import { Link } from "react-router-dom";
import { useAddToCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import useNotification from "../../hooks/useNotification";

function ProductCard({ product }) {
  const addToCartMutation = useAddToCart();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { notify } = useNotification();

  const discount = product.discount || null;
  const hasDiscount = Boolean(discount);
  const productImage = product.imageUrl || product.image || "";
  const isLoggedIn = Boolean(user);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      notify.error("Please log in to add items to your cart.", {
        action: {
          text: "Log In",
          onClick: () => {
            window.location.href = "/login";
          },
        },
      });
      return;
    }

    if (addToCartMutation.isPending) return;
    if (product.stock === 0) return;

    setError(null);
    addToCartMutation.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
          notify.success("Added to cart successfully.");
        },
        onError: (err) => {
          const message = err.response?.data?.message || "Failed to add to cart";
          setError(message);
          setTimeout(() => setError(null), 3000);
        },
      }
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block">
{/* Changed to aspect-[16/10] for an even shorter/more compact height on mobile */}
<div className="relative aspect-[16/10] sm:aspect-[3/4] overflow-hidden bg-gray-100">
  {productImage ? (
    <img
      src={productImage}
      alt={product.name}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-gray-400">
      No Image
    </div>
  )}

  {hasDiscount && (
    <span className="absolute left-2.5 top-2.5 rounded-full bg-red-500 px-2 py-1 text-[11px] sm:text-xs font-semibold text-white">
      {discount}
    </span>
  )}

  {!hasDiscount && product.isActive !== false && (
    <span className="absolute left-2.5 top-2.5 rounded-full bg-gray-900 px-2 py-1 text-[11px] sm:text-xs font-semibold text-white">
      New
    </span>
  )}

  <button
    type="button"
    aria-label="Add to wishlist"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-2 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </button>
</div>
      </Link>

      <div className="p-3 sm:p-4">
        <p className="text-[11px] sm:text-xs text-gray-500">
          {product.category?.name}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 sm:mt-2 flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-gray-900">
            ${product.price}
          </span>

          {hasDiscount && product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <div className="mt-1.5 sm:mt-2 flex items-center gap-1">
          <div className="flex text-orange-500">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] sm:text-xs text-gray-500">(128)</span>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0 || addToCartMutation.isPending}
          className="mt-2.5 sm:mt-3 flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {addToCartMutation.isPending
            ? "Adding..."
            : added
              ? "Added ✓"
              : product.stock === 0
                ? "Out of Stock"
                : "Quick Add"}
        </button>

        {error && isLoggedIn && (
          <p className="mt-2 text-[11px] sm:text-xs text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
