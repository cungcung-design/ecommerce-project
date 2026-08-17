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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedProduct, setDisplayedProduct] = useState(null);

  const current = products[activeIndex];

  useEffect(() => {
    if (current) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedProduct(current);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [activeIndex, current]);

  const handleSelect = (index) => {
    if (index === activeIndex || isTransitioning) return;
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <section className="bg-stone-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                BEST SELLERS
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                The pieces everyone loves
              </h2>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-4xl mx-auto">
            <div className="lg:col-span-5 max-w-xs mx-auto lg:max-w-none w-full">
              <div className="aspect-[4/5] w-full animate-pulse bg-gray-200 rounded-sm" />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) {
    return (
      <section className="bg-stone-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                BEST SELLERS
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                The pieces everyone loves
              </h2>
            </div>
          </div>
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-sm text-gray-500">
              Best sellers are being updated. Check back soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-stone-50 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              BEST SELLERS
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              The pieces everyone loves
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 tabular-nums">
              {pad(activeIndex + 1)} / {pad(products.length)}
            </span>
            <Link
              to="/products?sort=best-selling"
              className="text-xs font-semibold text-gray-900 hover:text-orange-600 transition-colors"
            >
              VIEW ALL →
            </Link>
          </div>
        </div>

        {/* Main Spotlight Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-4xl mx-auto">
          {/* Left: Product Image */}
          <div className="lg:col-span-5 max-w-xs mx-auto lg:max-w-none w-full">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm shadow-sm">
              {displayedProduct && (
                <div
                  key={displayedProduct.id}
                  className="h-full w-full animate-image-reveal"
                >
                  <img
                    src={displayedProduct.image}
                    alt={displayedProduct.name}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div
              key={`info-${current.id}`}
              className="space-y-3 animate-fade-in-up"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600">
                BEST SELLER
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {current.name}
              </h3>

              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {current.category?.name || "Collection"}
              </p>

              <p className="text-xl font-bold text-gray-900">
                ${Number(current.price).toFixed(2)}
              </p>

              <div>
                <Link
                  to={`/products/${current.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-orange-600 transition-colors group"
                >
                  EXPLORE PRODUCT
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile counter + view all */}
        <div className="mt-6 flex items-center justify-between sm:hidden">
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

        {/* Numbered Navigation */}
        <div className="mt-8 sm:mt-10 space-y-2 max-w-3xl mx-auto">
          {products.map((product, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={product.id}
                onClick={() => handleSelect(index)}
                disabled={isTransitioning}
                aria-label={`View ${product.name}`}
                aria-pressed={isActive}
                className={[
                  "group flex items-center gap-3 w-full text-left transition-all duration-300 py-1",
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-75",
                  isTransitioning ? "cursor-wait" : "cursor-pointer",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span
                  className={[
                    "text-xs font-semibold tabular-nums transition-colors duration-300",
                    isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {pad(index + 1)}
                </span>

                <span className="flex-1 h-px bg-gray-200 transition-all duration-300 group-hover:bg-gray-300">
                  <span
                    className={[
                      "block h-full bg-gray-900 transition-all duration-500 ease-out",
                      isActive ? "w-full" : "w-0 group-hover:w-1/3",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                </span>

                <span
                  className={[
                    "text-xs font-medium transition-all duration-300 truncate max-w-[150px] sm:max-w-xs",
                    isActive ? "text-gray-900 font-semibold" : "text-gray-400 group-hover:text-gray-600",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {product.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BestSellersSection;
