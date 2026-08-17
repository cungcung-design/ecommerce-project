import { Link } from "react-router-dom";

function NewArrivalsSection({ id, products = [], viewAllLink = "/products?sort=newest" }) {
  const featured = products[0];
  const remaining = products.slice(1, 5);

  if (!featured) return null;

  const featuredImage = featured.imageUrl || featured.image || "";

  return (
    <section id={id} className="bg-stone-50 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-600">
              New Arrivals
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Discover our latest collection
            </p>
          </div>
          <Link
            to={viewAllLink}
            className="text-xs font-semibold text-gray-900 hover:text-orange-600 transition-colors"
          >
            VIEW ALL →
          </Link>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Featured Product */}
          <div className="lg:col-span-6">
            <Link to={`/products/${featured.id}`} className="group block">
              <div className="relative aspect-[4/3] sm:aspect-[4/4] max-w-sm mx-auto lg:max-w-none overflow-hidden bg-gray-100 rounded-sm">
                {featuredImage ? (
                  <img
                    src={featuredImage}
                    alt={featured.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-4 text-center lg:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600">
                  {featured.category?.name || "New Arrival"}
                </p>
                <h3 className="mt-1 text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  {featured.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  ${featured.price}
                </p>
                <span className="mt-2 inline-flex items-center text-xs font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Explore Product →
                </span>
              </div>
            </Link>
          </div>

          {/* 4 Small Products */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {remaining.map((product) => {
                const image = product.imageUrl || product.image || "";
                const badge = product.badge || product.discount;

                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      {badge && (
                        <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-bold text-white">
                          {badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-[11px] text-gray-500">
                        {product.category?.name}
                      </p>
                      <h3 className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
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