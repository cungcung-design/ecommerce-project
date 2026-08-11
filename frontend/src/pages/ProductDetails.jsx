import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useProduct } from "../hooks/useProduct";
import { useAddToCart } from "../hooks/useCart";

function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id);
  const addToCart = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return <div className="p-8">Loading product...</div>;
  }

  if (isError || !product) {
    return <div className="p-8">Product not found.</div>;
  }

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-2xl object-cover"
          />
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500">{product.category?.name}</p>
        <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold">${product.price}</p>
        <p className="mt-6 text-gray-600">{product.description}</p>
        <p className="mt-4">Stock: {product.stock}</p>

        {product.stock > 0 ? (
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={addToCart.isPending}
                className="rounded border px-3 py-2 disabled:opacity-40"
              >
                -
              </button>

              <span className="w-8 text-center">{quantity}</span>

              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={addToCart.isPending}
                className="rounded border px-3 py-2 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-40"
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
          </div>
        ) : (
          <button
            disabled
            className="mt-8 rounded-lg bg-gray-400 px-6 py-3 text-white"
          >
            Out of Stock
          </button>
        )}

        <div className="mt-6">
          <Link to="/products" className="text-sm underline">
            ← Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
