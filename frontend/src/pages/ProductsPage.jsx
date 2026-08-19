import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/cards/ProductCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Products() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const categoryIdParam = searchParams.get("categoryId");
  const categoryId = categoryIdParam && !isNaN(Number(categoryIdParam))
    ? Number(categoryIdParam)
    : (categoryParam && !isNaN(Number(categoryParam)) ? Number(categoryParam) : undefined);
  const sort = searchParams.get("sort");
  const isNewArrivals = sort === "newest";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [categoryId, sort, page]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProducts({
    search,
    categoryId,
    page,
    limit: 12,
    sort,
  });

  const { data: categories = [] } = useCategories();

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleCategoryChange = (id) => {
    if (id) {
      searchParams.set("category", String(id));
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
    setPage(1);
  };

  const clearCategory = () => {
    searchParams.delete("category");
    setSearchParams(searchParams);
    setPage(1);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message ||
          "Failed to load products"
        }
      />
    );
  }

  const products = data?.products || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mt-8">
        <h1 className="text-3xl font-bold">
          {selectedCategory ? selectedCategory.name : "Products"}
        </h1>

        {selectedCategory && (
          <button
            onClick={clearCategory}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Category Filter */}
      <div className="mt-4">
        <select
          value={selectedCategory ? selectedCategory.id : ""}
          onChange={(event) => {
            const value = event.target.value;
            handleCategoryChange(value ? Number(value) : undefined);
          }}
          className="rounded-lg border p-3 w-full"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          {isNewArrivals ? "No new arrivals right now." : "No products found."}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((current) => current - 1)
          }
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page}
        </span>

        <button
          disabled={
            page >= data.pagination.totalPages
          }
          onClick={() =>
            setPage((current) => current + 1)
          }
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;