const categories = [
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop",
    href: "/products",
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
    href: "/products",
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
    href: "/products",
  },
  {
    name: "Fitness",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop",
    href: "/products",
  },
  {
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=500&fit=crop",
    href: "/products",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
    href: "/products",
  },
];

function CategoriesSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            Shop by Categories
          </h2>

          <a
            href="/products"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            View All Categories →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-sm font-semibold text-white">
                  {category.name}
                </h3>

                <span className="mt-1 flex items-center text-xs text-gray-200 transition-colors group-hover:text-white">
                  Shop Now
                  <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
