import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

function NewArrivalsSection({ id, viewAllLink = "/products?sort=newest" }) {
  const { data, isLoading, isError } = useProducts({
    sort: "newest",
    limit: 5,
  });

  const products = data?.products || [];
  const featured = products[0];
  const remaining = products.slice(1, 5);

  if (isLoading) {
    return (
      <section id={id} className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
            <div>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-600">
            New Arrivals
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight font-serif">
            New Arrivals
          </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Discover our latest collection
              </p>
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors self-end sm:self-auto"
            >
              VIEW ALL →
            </button>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-6">
            <div className="aspect-[5/4] w-full animate-pulse bg-gray-100 rounded-2xl" />
          </div>
            <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-gray-100 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !featured) {
    return (
      <section id={id} className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-600">
            New Arrivals
          </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight font-serif">
                New Arrivals
              </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Discover our latest collection
          </p>
          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            New arrivals are being updated. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  const featuredImage = featured.imageUrl || featured.image || "";

  return (
    <section id={id} className="bg-white py-8 sm:py-12 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8 lg:mb-10">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-600">
              Our Collection
            </span>
            <div className="flex items-center justify-between sm:block">
              <h2 className="mt-1 text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight font-serif">
                New Arrivals
              </h2>
<button
  type="button"
  tabIndex={-1}
  className="text-xs sm:text-sm font-semibold hover:text-orange-600 transition-colors inline-flex items-center gap-1 sm:hidden"
>
  View All →
</button>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Discover our latest curated styles and trending drops.
            </p>
          </div>
<button
  type="button"
  tabIndex={-1}
  className="hidden sm:inline-flex text-xs sm:text-sm font-semibold hover:text-orange-600 transition-colors items-center gap-1"
>
  View All →
</button>
        </div>

        {/* Main Balanced Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Side: Big Featured Image */}
          <div className="lg:col-span-6 flex flex-col">
            <Link to={`/products/${featured.id}`} className="group relative block w-full h-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm border border-gray-100">
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={featured.name}
                  className="aspect-[5/4] w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-[5/4] w-full items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}

              {/* Subtle Dark Gradient for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Floating Info Box */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-6 rounded-2xl bg-white/65 backdrop-blur-3xl shadow-2xl border border-white/50 transition-all duration-300 group-hover:translate-y-[-3px] group-hover:bg-white/75">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-xl font-medium text-gray-900 tracking-tight line-clamp-1">
                    {featured.name}
                  </h3>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900">
                    ${featured.price}
                  </p>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-gray-900/10 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-600">
                    Limited Edition
                  </span>
                  <span className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-orange-600 group-hover:translate-x-1 transition-transform">
                    Explore Product →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side: 4 Products Matched to Left Height */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 h-full">
              {remaining.map((product) => {
                const image = product.imageUrl || product.image || "";
                const badge = product.badge || product.discount;

                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group flex flex-col justify-between bg-white h-full"
                  >
                    <div className="relative w-full flex-1 min-h-[140px] sm:min-h-[180px] overflow-hidden bg-gray-100 rounded-xl sm:rounded-2xl shadow-sm">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      {badge && (
                        <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md z-10">
                          {badge}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 pt-1">
                      <p className="text-[11px] sm:text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {product.category?.name || "Accessory"}
                      </p>
                      <h3 className="mt-0.5 text-xs sm:text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-900">
                        ${product.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default NewArrivalsSection;