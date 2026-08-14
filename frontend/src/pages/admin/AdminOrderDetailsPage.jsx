import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

import { useAdminOrder } from "../../hooks/useAdminOrder";
import AdminOrderDetails from "../../components/admin/AdminOrderDetails";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useAdminOrder(id);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto mt-12 p-5 rounded-2xl border border-rose-100 bg-rose-50 text-center space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h3 className="font-bold text-rose-900 text-sm">Order not found</h3>
          <p className="text-xs text-rose-600">
            The order you are looking for doesn't exist or has been removed.
          </p>
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Order #{order.id}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage fulfillment, status updates, and customer shipping details.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-orange-50 hover:border-orange-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-orange-600 shadow-sm transition-all self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
      </div>

      {/* Main Order Details Component */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
        <AdminOrderDetails order={order} />
      </div>
    </div>
  );
}