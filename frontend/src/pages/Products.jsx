import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/cards/ProductCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProducts({
    search,
    category,
    page,
    limit: 12,
  });

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
    <div>
      <h1 className="text-3xl font-bold">
        Products
      </h1>

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

      {/* Category */}
      <div className="mt-4">
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border p-3"
        >
          <option value="">
            All Categories
          </option>

          <option value="electronics">
            Electronics
          </option>

          <option value="clothing">
            Clothing
          </option>

          <option value="books">
            Books
          </option>
        </select>
      </div>

      {/* Products */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

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