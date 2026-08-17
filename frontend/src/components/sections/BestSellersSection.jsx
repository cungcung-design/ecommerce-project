import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

const pad = (num) => String(num).padStart(2, "0");

function BestSellersSection() {
  const { data, isLoading, isError } = useProducts({
    sort: "best-selling",
    limit: 4,
  });

  const products = data?.products || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedProduct, setDisplayedProduct] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const current = products[activeIndex];
  const productImage = current?.imageUrl || current?.image || "";

  useEffect(() => {
    if (!current) return;
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayedProduct(current);
      setIsTransitioning(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [activeIndex, current]);

  const handleSelect = (index) => {
    if (index === activeIndex || isTransitioning) return;
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 sm:mb-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                Best Sellers
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                The pieces everyone loves
              </h2>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] w-full animate-pulse bg-gray-100 rounded-sm" />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-10 w-72 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-7 w-28 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) {
    return (
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            Best Sellers
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            The pieces everyone loves
          </h2>
          <p className="mt-4 text-sm text-gray-500">
            Best sellers are being updated. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Best Sellers
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              The pieces everyone loves
            </h2>
          </div>

          <Link
            to="/products?sort=best-selling"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors group"
          >
            View All
            <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Main Spotlight */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: Image */}
          <div className="lg:col-span-5">
            <Link to={`/products/${current.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                {displayedProduct && (
                  <img
                    key={displayedProduct.id}
                    src={productImage}
                    alt={displayedProduct.name}
                    className={`h-full w-full object-cover transition-all duration-500 ease-out ${
                      isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
                    } group-hover:scale-105`}
                    loading="eager"
                  />
                )}
              </div>
            </Link>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7">
            <div
              key={`info-${current.id}`}
              className={`transition-all duration-300 ${
                isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                Best Seller
              </span>

              <h3 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {current.name}
              </h3>

              <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
                {current.category?.name || "Collection"}
              </p>

              <p className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
                ${Number(current.price).toFixed(2)}
              </p>

              <div className="mt-6">
                <Link
                  to={`/products/${current.id}`}
                  className="inline-flex items-center gap-3 text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors group"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 group-hover:border-orange-600 group-hover:bg-orange-50 transition-all">
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                  Explore Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Counter + View All */}
        <div className="mt-8 flex items-center justify-between sm:hidden">
          <span className="text-xs font-medium text-gray-500 tabular-nums">
            {pad(activeIndex + 1)} / {pad(products.length)}
          </span>
          <Link
            to="/products?sort=best-selling"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            VIEW ALL →
          </Link>
        </div>

        {/* Product Navigation */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {products.map((product, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={product.id}
                  onClick={() => handleSelect(index)}
                  disabled={isTransitioning}
                  aria-label={`View ${product.name}`}
                  aria-pressed={isActive}
                  className={`relative flex items-center gap-3 sm:gap-4 text-left transition-all duration-300 py-1 shrink-0 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-50 hover:opacity-80"
                  } ${isTransitioning ? "cursor-wait" : "cursor-pointer"}`}
                >
                  <span
                    className={`text-xs font-semibold tabular-nums transition-colors duration-300 ${
                      isActive ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {pad(index + 1)}
                  </span>

                  <span className="relative flex-1 h-px bg-gray-200 transition-all duration-300 min-w-[40px] sm:min-w-[60px]">
                    <span
                      className={`absolute left-0 top-0 h-full bg-gray-900 transition-all duration-500 ease-out ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </span>

                  <span
                    className={`text-xs sm:text-sm font-medium transition-all duration-300 truncate max-w-[120px] sm:max-w-[200px] ${
                      isActive
                        ? "text-gray-900 font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    {product.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSellersSection;
