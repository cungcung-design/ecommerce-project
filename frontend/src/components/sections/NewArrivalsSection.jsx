import { Link } from "react-router-dom";

function NewArrivalsSection({ id, products = [], viewAllLink = "/products?sort=newest" }) {
  const featured = products[0];
  const remaining = products.slice(1, 5);

  if (!featured) return null;

  const featuredImage = featured.imageUrl || featured.image || "";

  return (
    <section id={id} className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              New Arrivals
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="mt-2 text-base text-gray-500">
              Discover our latest collection
            </p>
          </div>
          <Link
            to={viewAllLink}
            className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors"
          >
            VIEW ALL →
          </Link>
        </div>

        {/* Main Layout - Adjusted to 6/6 split to make the left side smaller */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Featured Product (Reduced width: lg:col-span-6 instead of 7) */}
          <div className="lg:col-span-6">
            <Link to={`/products/${featured.id}`} className="group block">
              <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none overflow-hidden bg-gray-100">
                {featuredImage ? (
                  <img
                    src={featuredImage}
                    alt={featured.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-6 text-center lg:text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                  {featured.category?.name || "New Arrival"}
                </p>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {featured.name}
                </h3>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  ${featured.price}
                </p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Explore Product →
                </span>
              </div>
            </Link>
          </div>

          {/* 4 Small Products (Increased width: lg:col-span-6 instead of 5) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {remaining.map((product) => {
                const image = product.imageUrl || product.image || "";
                const badge = product.badge || product.discount;

                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
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
                        <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white">
                          {badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5">
                      <p className="text-xs text-gray-500">
                        {product.category?.name}
                      </p>
                      <h3 className="mt-0.5 text-sm font-semibold text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
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