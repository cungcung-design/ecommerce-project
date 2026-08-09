import { useParams } from "react-router-dom";

import { useOrder } from "../hooks/useOrder";

function OrderDetails() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useOrder(id);

  if (isLoading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8">
        Order not found.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Order #{order.id}
      </h1>

      <p className="mt-3">
        Status: {order.status}
      </p>

      <div className="mt-8 space-y-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between rounded-lg border p-4"
          >
            <div>
              <h2 className="font-semibold">
                {item.product.name}
              </h2>

              <p>
                Quantity: {item.quantity}
              </p>
            </div>

            <p>
              $
              {(Number(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6 text-right">
        <p className="text-xl font-bold">
          Total: ${order.totalAmount}
        </p>
      </div>
    </div>
  );
}

export default OrderDetails;
