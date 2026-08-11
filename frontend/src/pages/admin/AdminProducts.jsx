import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useAdminProducts,
} from "../../hooks/useAdminProducts";

import { useCategories } from "../../hooks/useCategories";

import AdminProductTable
  from "../../components/admin/AdminProductTable";

function AdminProducts() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useAdminProducts({
    search,
    categoryId: categoryId || undefined,
    isActive: isActive || undefined,
    page,
    limit: 10,
  });

  const { data: categories } = useCategories();

  const products = data?.products || [];
  const pagination = data?.pagination || {};

  if (isLoading) {
    return (
      <div className="p-8">
        Loading products...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        Failed to load products.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your products
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Add Product
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="w-full max-w-md rounded-lg border bg-white px-4 py-3 outline-none"
        />

        <select
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border bg-white px-4 py-3 outline-none"
        >
          <option value="">
            All Categories
          </option>

          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={isActive}
          onChange={(event) => {
            setIsActive(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border bg-white px-4 py-3 outline-none"
        >
          <option value="">
            All Status
          </option>

          <option value="true">
            Active
          </option>

          <option value="false">
            Inactive
          </option>
        </select>
      </div>

      <AdminProductTable
        products={products}
        pagination={pagination}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default AdminProducts;
