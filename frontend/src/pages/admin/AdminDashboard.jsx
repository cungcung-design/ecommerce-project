import {
  useAdminDashboard,
} from "../../hooks/useAdminDashboard";

import AdminDashboardCard
  from "../../components/admin/AdminDashboardCard";

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your store
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminDashboardCard
          title="Total Users"
          value={data.users}
        />

        <AdminDashboardCard
          title="Products"
          value={data.products}
        />

        <AdminDashboardCard
          title="Orders"
          value={data.orders}
        />

        <AdminDashboardCard
          title="Revenue"
          value={`$${data.revenue}`}
        />
      </div>

      <div className="mt-6 rounded-xl border bg-white">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Recent Orders
          </h2>
        </div>

        <div className="divide-y">
          {data.recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-6"
            >
              <div>
                <p className="font-medium">
                  Order #{order.id}
                </p>

                <p className="text-sm text-gray-500">
                  {order.user.name}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ${order.totalAmount}
                </p>

                <p className="text-sm text-gray-500">
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
