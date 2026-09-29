import { Link, useParams } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";

import { useOrder } from "../hooks/useOrders";
import { SHOP_PATH } from "../lib/authRedirect";

function OrderConfirmationPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-slate-500">Loading your order...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
          <h1 className="mt-4 text-xl font-medium text-slate-900 font-serif">Order not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            We couldn&apos;t find that order. It may have been removed, or you may not have access to it.
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            View my orders
          </Link>
        </div>
      </div>
    );
  }

  const total = Number(order.totalAmount);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">
      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
            Order confirmed
          </h1>
          <p className="text-sm font-medium text-slate-500">Thank you for your order.</p>
        </div>
        <div className="space-y-1 text-sm text-slate-700">
          <p className="font-semibold">Order #{order.id}</p>
          <p>Total: ${Number.isFinite(total) ? total.toFixed(2) : "0.00"}</p>
        </div>
        <Link
          to={`/orders/${order.id}`}
          className="block w-full rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition-colors hover:bg-orange-700"
        >
          View order
        </Link>
        <Link
          to={SHOP_PATH}
          className="inline-block text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
