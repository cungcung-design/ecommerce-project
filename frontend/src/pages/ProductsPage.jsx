import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { getFriendlyError } from "../lib/getFriendlyError";
import ProductCard from "../components/cards/ProductCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read state directly from URL params for source of truth
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");
  const categoryIdParam = searchParams.get("categoryId");
  const categoryId = categoryIdParam && !isNaN(Number(categoryIdParam))
    ? Number(categoryIdParam)
    : (categoryParam && !isNaN(Number(categoryParam)) ? Number(categoryParam) : undefined);
  const sort = searchParams.get("sort") || "featured";
  const pageParam = searchParams.get("page");
  const page = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;

  const isNewArrivals = sort === "newest";

  // Local state for immediate input feedback while typing
  const [searchInput, setSearchInput] = useState(searchParam);

  // Scroll to top on filter or page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryId, sort, page]);

  // Sync local search input if URL changes externally
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Debounced handler to update URL search param after user stops typing
  const debounceRef = useRef(null);
  const handleDebouncedSearch = useCallback((value) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (value) {
        searchParams.set("search", value);
      } else {
        searchParams.delete("search");
      }
      searchParams.set("page", "1");
      setSearchParams(searchParams);
    }, 400);
  }, [searchParams, setSearchParams]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProducts({
    search: searchParam,
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
    searchParams.set("page", "1");
    setSearchParams(searchParams);
    setIsMobileFilterOpen(false);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value) {
      searchParams.set("sort", value);
    } else {
      searchParams.delete("sort");
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  const handlePageChange = (newPage) => {
    searchParams.set("page", String(newPage));
    setSearchParams(searchParams);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={getFriendlyError(error, "Failed to load products")}
      />
    );
  }

  const products = data?.products || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Results Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-medium font-serif">
            {selectedCategory ? selectedCategory.name : "All Products"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing catalog items {searchParam ? `matching "${searchParam}"` : ""}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={handleSortChange}
            className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="newest">Sort by: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm"
          >
            Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop & Expandable Mobile) */}
        <aside
          className={`lg:block ${
            isMobileFilterOpen ? "block" : "hidden"
          } space-y-6 lg:col-span-1 bg-gray-50 lg:bg-transparent p-4 lg:p-0 rounded-xl border lg:border-none`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="font-semibold text-lg">Filters</h2>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleDebouncedSearch(e.target.value);
              }}
              className="w-full rounded-lg border bg-white p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category List Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Categories
              </label>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange(undefined)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
              <button
                onClick={() => handleCategoryChange(undefined)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory?.id === category.id
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {(searchParam || categoryId || sort !== "featured") && (
            <button
              onClick={clearAllFilters}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Product Grid Section */}
        <main className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="my-16 text-center rounded-xl border border-dashed p-12 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {isNewArrivals
                  ? "No new arrivals match your selected filters right now."
                  : "Try adjusting your search or filter criteria to find what you're looking for."}
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 rounded-lg bg-orange-600 text-white px-4 py-2 text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span> of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;