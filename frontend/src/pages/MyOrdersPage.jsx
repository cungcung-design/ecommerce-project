import { Link } from "react-router-dom";

import { useOrders } from "../hooks/useOrders";

import OrderCard from "../components/orders/OrderCard";

function MyOrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useOrders();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-red-600">
          Failed to load orders.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-gray-600">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
