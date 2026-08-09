import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="overflow-hidden rounded-xl border">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-52 w-full object-cover"
        />
      )}

      <div className="p-4">
        <p className="text-sm text-gray-500">
          {product.category?.name}
        </p>

        <h2 className="mt-1 text-lg font-semibold">
          {product.name}
        </h2>

        <p className="mt-2 font-medium">
          ${product.price}
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            View
          </Link>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;