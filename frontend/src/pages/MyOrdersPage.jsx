import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { statusLabels, statusColors } from "../validators/adminOrderValidator";
import OrderCard from "../components/orders/OrderCard";

import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw 
} from "lucide-react";

const STATUS_FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PROCESSING: RefreshCw,
  SHIPPED: Truck,
  DELIVERED: Package,
};

function StatusFlowIndicator({ currentStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none text-xs w-full">
      {STATUS_FLOW.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = status === currentStatus;
        const IconComponent = statusIcons[status] || Package;

        return (
          <div key={status} className="flex items-center gap-1.5 shrink-0">
            {index > 0 && (
              <div 
                className={`h-0.5 w-3 sm:w-6 transition-colors ${
                  isActive ? "bg-indigo-600" : "bg-slate-200"
                }`} 
              />
            )}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium text-[11px] transition-all ${
                isCurrent
                  ? `${statusColors[status] ?? "bg-indigo-600 text-white"} shadow-sm font-semibold`
                  : isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              <IconComponent className="w-3 h-3" />
              <span className="whitespace-nowrap">{statusLabels[status]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MyOrdersPage() {
  const { data: orders = [], isLoading, isError } = useOrders();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-3">
        <div className="w-10 h-10 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
        <h3 className="text-sm font-semibold text-rose-900">Unable to load orders</h3>
        <p className="text-xs text-rose-600">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-serif">My Orders</h1>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {/* Latest Order Flow Widget */}
      {orders.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">Latest Status Tracker</span>
            <span className="font-semibold text-slate-600">{String(orders[0]?.id).slice(-6).toUpperCase()}</span>
          </div>
          <StatusFlowIndicator currentStatus={orders[0]?.status ?? "PENDING"} />
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 space-y-3">
          <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">No orders yet</p>
            <p className="text-xs text-slate-500">When you place orders, they will appear here.</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-xs font-semibold hover:bg-indigo-600 transition-colors"
          >
            Start Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order History</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;