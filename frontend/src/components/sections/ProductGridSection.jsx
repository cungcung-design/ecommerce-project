import { Link } from "react-router-dom";
import ProductCard from "../cards/ProductCard";

function ProductGridSection({ title, actionText, products, viewAllLink = "/products", id }) {
  return (
    <section id={id} className="bg-white">
      <div className="px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-medium text-gray-900 font-serif truncate">
            {title}
          </h2>

          <Link
            to={viewAllLink}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            {actionText}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGridSection;
