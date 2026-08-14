import { useState } from "react";
import { Link } from "react-router-dom";

import { useAdminOrders } from "../../hooks/useAdminOrders";

import AdminOrderTable from "../../components/admin/AdminOrderTable";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useAdminOrders({
    q: search,
    status: statusFilter || undefined,
    page,
    limit: 10,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination || {};

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-gray-400">
          Loading orders...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-red-400">
          Failed to load orders.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Refresh
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by customer name or email..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order Table / Cards */}
      <AdminOrderTable
        orders={orders}
        pagination={pagination}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default AdminOrders;
