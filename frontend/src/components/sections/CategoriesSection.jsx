import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

const categories = [
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop",
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
  },
  {
    name: "Fitness",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop",
  },
  {
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=500&fit=crop",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
  },
];

function CategoriesSection() {
  const { data: dbCategories = [], isError } = useCategories();

  return (
    <section id="categories" className="bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 font-serif">
            Shop by Categories
          </h2>
<Link
  to="/products"
  className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-orange-600 transition-colors"
>
  View All →
</Link>
        </div>

        {isError && (
          <p className="mt-4 text-sm text-red-500">
            Failed to load categories.
          </p>
        )}

        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const matched = dbCategories.find((c) => c.name === category.name);
            const to = matched
              ? `/products?category=${matched.id}`
              : "/products";

            return (
              <Link
                key={category.name}
                to={to}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-medium text-white">
                    {category.name}
                  </h3>

                  <span className="mt-0.5 sm:mt-1 flex items-center text-[11px] sm:text-xs text-gray-200 transition-colors group-hover:text-white">
                    Shop Now
                    <span className="ml-0.5 sm:ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
