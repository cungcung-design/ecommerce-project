import { useAdminDashboard } from "../../hooks/useAdminDashboard";

function Dashboard() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="p-8">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        Failed to load dashboard.
      </div>
    );
  }

  const cards = [
    {
      label: "Users",
      value: stats.totalUsers,
    },
    {
      label: "Products",
      value: stats.totalProducts,
    },
    {
      label: "Orders",
      value: stats.totalOrders,
    },
    {
      label: "Sales",
      value: `$${Number(stats.totalSales).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border p-6"
          >
            <p className="text-sm text-gray-500">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
