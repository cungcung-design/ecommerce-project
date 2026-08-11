import ProductCard from "../cards/ProductCard";

function ProductGridSection({ title, actionText, products, viewAllLink = "/products" }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            {title}
          </h2>

          <a
            href={viewAllLink}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            {actionText}
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGridSection;
