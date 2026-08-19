import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Zap, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check 
} from "lucide-react";

import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";
import { useAddToCart } from "../hooks/useCart";
import useNotification from "../hooks/useNotification";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProductCard from "../components/cards/ProductCard";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);
  const addToCart = useAddToCart();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: relatedData } = useProducts({
    categoryId: product?.category?.id,
    limit: 4,
  });

  const relatedProducts = relatedData?.products?.filter((p) => p.id !== product?.id) || [];
  const { notify } = useNotification();
  const isLoggedIn = Boolean(user);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !product) {
    return <ErrorMessage message="Product not found." />;
  }

  const discount = product.discount || product.badge || null;
  const hasDiscount = Boolean(discount);
  const productImage = product.imageUrl || product.image || "";
  const reviewCount = product.reviews || 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      notify.error("Please log in to add items to your cart.", {
        action: {
          text: "Log In",
          onClick: () => {
            navigate("/login");
          },
        },
      });
      return;
    }

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      notify.success("Added to cart successfully.");
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      notify.error("Please log in to add items to your cart.", {
        action: {
          text: "Log In",
          onClick: () => {
            navigate("/login");
          },
        },
      });
      return;
    }

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity,
      });
      navigate("/checkout");
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-12">
      {/* Back Link */}
      <div>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors bg-slate-100/80 hover:bg-orange-50 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to products
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Image */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 shadow-sm flex items-center justify-center aspect-[4/3]">
            {productImage ? (
              <img
                src={productImage}
                alt={product.name}
                className="h-full w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 font-medium text-sm">
                No Image Available
              </div>
            )}
            {hasDiscount && (
              <span className="absolute top-4 left-4 rounded-full bg-rose-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                {discount}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              {product.category?.name || "Category"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Reviews */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">${product.price}</span>
              {hasDiscount && product.originalPrice && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/60">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-900">({reviewCount} reviews)</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Stock Availability */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability:</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md ${product.stock > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              {product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"}
            </span>
          </div>

          {/* Actions & Quantity */}
          {product.stock > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-50 p-1 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={addToCart.isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm border border-slate-200/60 disabled:opacity-40 hover:bg-slate-100 transition-all font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={addToCart.isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm border border-slate-200/60 disabled:opacity-40 hover:bg-slate-100 transition-all font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending || product.stock === 0}
                  className={`flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 disabled:opacity-40 ${
                    added 
                      ? "bg-emerald-600 shadow-emerald-600/25" 
                      : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/25 hover:scale-[1.02]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={addToCart.isPending || product.stock === 0}
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition-all duration-300 hover:scale-[1.01] disabled:opacity-40"
              >
                <Zap className="w-4 h-4 text-orange-400 fill-orange-400" /> Buy Now
              </button>
            </div>
          )}

          {/* Value Props Mini Grid */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-orange-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Free Shipping</span>
              <span className="text-[10px] text-slate-400">On orders $50+</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-orange-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Secure Pay</span>
              <span className="text-[10px] text-slate-400">100% Protected</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-4 h-4 text-orange-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Easy Returns</span>
              <span className="text-[10px] text-slate-400">30-day policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;