import { Link } from "react-router-dom";

function formatMoney(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "";
  }

  return `$${value.toFixed(2)}`;
}

export default function AIOrderCard({ order }) {
  if (!order) {
    return null;
  }

  return (
    <Link
      to={`/orders/${order.id}`}
      className="mt-2 block rounded-xl border border-slate-200 bg-white p-3 text-slate-800 hover:border-orange-200"
    >
      <p className="text-sm font-semibold">Order #{order.id}</p>
      <p className="mt-1 text-sm text-slate-600">{order.status}</p>
      {order.totalAmount != null && (
        <p className="mt-1 text-xs text-slate-500">{formatMoney(order.totalAmount)}</p>
      )}
    </Link>
  );
}
