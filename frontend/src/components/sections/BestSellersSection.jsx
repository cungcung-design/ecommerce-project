import { useState } from "react";
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

  const current = products[activeIndex];
  const productImage = current?.imageUrl || current?.image || "";

  const handleSelect = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <section className="bg-white py-16 sm:py-20">
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Even taller aspect ratio: aspect-[1/1] (Square) or aspect-[5/4] */}
            <div className="aspect-[5/4] w-full animate-pulse bg-gray-100 rounded-2xl" />
            <div className="space-y-6">
              <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-28 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) {
    return (
      <section className="bg-white py-16 sm:py-20">
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
    <section className="bg-white py-16 sm:py-20">
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
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Image */}
          <div className="lg:col-span-6 flex flex-col">
            <Link to={`/products/${current.id}`} className="group relative block w-full h-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm border border-gray-100">
              {productImage ? (
                <img
                  src={productImage}
                  alt={current.name}
                  className="aspect-[5/4] w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="eager"
                />
              ) : (
                <div className="flex aspect-[5/4] w-full items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </Link>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-6 flex flex-col justify-center h-full py-4">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Best Seller #{pad(activeIndex + 1)}
            </span>

            <h3 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              {current.name}
            </h3>

            <p className="mt-3 text-sm font-medium text-gray-500 uppercase tracking-widest">
              {current.category?.name || "Collection"}
            </p>

            <p className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
              ${Number(current.price).toFixed(2)}
            </p>

            <div className="mt-8">
              <Link
                to={`/products/${current.id}`}
                className="inline-flex items-center gap-3 text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors group"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 group-hover:border-orange-600 group-hover:bg-orange-50 transition-all shadow-sm">
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
                Explore Product
              </Link>
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

        {/* Product Navigation Grid Cards */}
        <div className="mt-16 sm:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => {
              const isActive = index === activeIndex;
              const thumbImage = product.imageUrl || product.image || "";

              return (
                <button
                  key={product.id}
                  onClick={() => handleSelect(index)}
                  aria-label={`View ${product.name}`}
                  aria-pressed={isActive}
                  className={`group relative flex items-center gap-4 text-left transition-all duration-300 p-4 border rounded-xl ${
                    isActive
                      ? "border-orange-600 bg-orange-50/20 shadow-sm ring-1 ring-orange-600/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                    {thumbImage && (
                      <img
                        src={thumbImage}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`block text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                        isActive ? "text-orange-600" : "text-gray-400"
                      }`}
                    >
                      No. {pad(index + 1)}
                    </span>
                    <p
                      className={`mt-0.5 text-xs sm:text-sm font-semibold truncate transition-colors duration-300 ${
                        isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                      }`}
                    >
                      {product.name}
                    </p>
                  </div>
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