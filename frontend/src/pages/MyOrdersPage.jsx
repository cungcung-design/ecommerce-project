import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { statusLabels, statusColors } from "../validators/adminOrderValidator";
import OrderCard from "../components/orders/OrderCard";

// Icons using Lucide React (standard modern React ecosystem choice)
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  RefreshCw
} from "lucide-react";

const STATUS_FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
const ACTION_REQUIRED = ["PENDING", "PROCESSING"];

// Mapping status to corresponding Lucide icons for visual polish
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
    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none text-xs">
      {STATUS_FLOW.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = status === currentStatus;
        const IconComponent = statusIcons[status] || Package;

        return (
          <div key={status} className="flex items-center gap-1 sm:gap-2 shrink-0">
            {index > 0 && (
              <div 
                className={`h-0.5 w-4 sm:w-8 transition-colors duration-500 ${
                  isActive ? "bg-indigo-500 shadow-sm shadow-indigo-500/20" : "bg-slate-200"
                }`} 
              />
            )}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-full font-medium transition-all duration-300 ${
                isCurrent
                  ? `${statusColors[status] ?? "bg-indigo-600 text-white"} shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30 scale-105`
                  : isActive
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    : "bg-slate-100 text-slate-400 border border-slate-200/60"
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isCurrent ? "animate-pulse" : ""}`} />
              <span className="whitespace-nowrap">{statusLabels[status]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MyOrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useOrders();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const actionRequiredOrders = orders.filter((order) =>
    ACTION_REQUIRED.includes(order.status)
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Curating your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-rose-900">Unable to load orders</h3>
        <p className="text-sm text-rose-600">
          Something went wrong while fetching your order history. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            My Orders
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-100/80 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200/60 shadow-sm">
          <Package className="w-4 h-4 text-indigo-600" />
          <span>{orders.length} {orders.length === 1 ? "order" : "orders"} total</span>
        </div>
      </div>

      {/* Action Required Alert Banners */}
      {actionRequiredOrders.length > 0 && (
        <div className="space-y-3">
          {actionRequiredOrders.map((order) => (
            <div
              key={`alert-${order.id}`}
              className="relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-orange-50/60 p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm backdrop-blur-sm"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500" />
              <div className="flex items-start gap-3.5 pl-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 mt-0.5 shadow-inner">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-amber-900">
                       Order {order.id}
                    </p>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-200/60 text-amber-800">
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-xs text-amber-700/90 mt-1 font-medium">
                    {order.status === "PENDING"
                      ? "Your payment is being processed. This will update automatically."
                      : "Your order is being processed. We'll notify you when it ships."}
                  </p>
                </div>
              </div>
              <Link
                to={`/orders/${order.id}`}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-200/70 hover:bg-amber-300/80 px-4 py-2 rounded-xl transition-all shadow-sm self-start sm:self-center ml-11 sm:ml-0"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Status Flow Tracker Widget */}
      {orders.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" /> Latest Order Status Flow
            </p>
            <span className="text-[11px] font-medium text-slate-400">Order {orders[0]?.id}</span>
          </div>
          <StatusFlowIndicator currentStatus={orders[0]?.status ?? "PENDING"} />
        </div>
      )}

      {/* Main Order List Section */}
      {orders.length === 0 ? (
        <div className="mt-12 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-12 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't placed any orders yet. Explore our catalog and start shopping today!
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-2 rounded-xl bg-slate-900 hover:bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/25 transition-all duration-300"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Order History</h2>
          </div>
          <div className="grid gap-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="transition-all duration-300 hover:-translate-y-0.5"
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;