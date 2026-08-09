import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useProduct } from "../hooks/useProduct";
import { useCartStore } from "../store/cartStore";

function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id);
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  if (isLoading) {
    return <div className="p-8">Loading product...</div>;
  }

  if (isError || !product) {
    return <div className="p-8">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-8 rounded-lg bg-black px-6 py-3 text-white disabled:opacity-40"
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
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
