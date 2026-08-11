import AdminDashboardCard
  from "../../components/admin/AdminDashboardCard";

import AdminRecentOrders
  from "../../components/admin/AdminRecentOrders";

import {
  useAdminDashboard,
} from "../../hooks/useAdminDashboard";

export default function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        {error?.response?.data?.message ||
          "Failed to load dashboard"}
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your store
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminDashboardCard
          title="Total Users"
          value={stats.totalUsers}
        />

        <AdminDashboardCard
          title="Total Products"
          value={stats.totalProducts}
        />

        <AdminDashboardCard
          title="Active Products"
          value={stats.activeProducts}
        />

        <AdminDashboardCard
          title="Total Orders"
          value={stats.totalOrders}
        />
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">
          Total Revenue
        </p>

        <p className="mt-2 text-3xl font-bold">
          ${stats.totalRevenue}
        </p>
      </div>

      <AdminRecentOrders
        orders={data?.recentOrders || []}
      />
    </div>
  );
}
