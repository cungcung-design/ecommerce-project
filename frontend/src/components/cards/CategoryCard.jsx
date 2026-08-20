import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link
      to={category.href || "/products"}
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
        <h3 className="text-sm font-medium text-white">
          {category.name}
        </h3>

        <span className="mt-1 flex items-center text-xs text-gray-200 transition-colors group-hover:text-white">
          Shop Now
          <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;
