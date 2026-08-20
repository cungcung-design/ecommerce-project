import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import {
  Package,
  CreditCard,
  Truck,
  MapPin,
  ArrowLeft,
  XCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useOrder, useCancelOrder } from "../hooks/useOrders";
import { useOrderPayment } from "../hooks/usePayment";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { getFriendlyError } from "../lib/getFriendlyError";

import OrderStatus from "../components/orders/OrderStatus";
import PaymentStatusBadge from "../components/payments/PaymentStatusBadge";
import { paymentStatusDescription } from "../validators/paymentValidator";
import { statusLabels } from "../validators/adminOrderValidator";
import { useInstantScrollToTop } from "../lib/scrollToTop";

const STATUS_ICONS = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PROCESSING: AlertCircle,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
};

const STATUS_DESCRIPTIONS = {
  PENDING: "Your order has been placed and is awaiting confirmation.",
  CONFIRMED: "Your order has been confirmed and is being prepared.",
  PROCESSING: "Your order is being processed for shipment.",
  SHIPPED: "Your order is on its way to you!",
  DELIVERED: "Your order has been delivered successfully.",
  CANCELLED: "This order has been cancelled.",
};

function StatusTimeline({ currentStatus }) {
  const steps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIndex = steps.indexOf(currentStatus);
  const isCancelled = currentStatus === "CANCELLED";

  if (isCancelled) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <XCircle className="mr-2 h-5 w-5" />
        <span className="font-medium">This order has been cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = step === currentStatus;
        const Icon = STATUS_ICONS[step] || Package;

        return (
          <div key={step} className="flex flex-1 items-center shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : isActive
                      ? "border-orange-400 bg-orange-100 text-orange-500"
                      : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`mt-1.5 text-xs font-medium ${
                  isCurrent ? "text-orange-600" : isActive ? "text-orange-500" : "text-gray-400"
                }`}
              >
                {statusLabels[step]}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1">
                <div
                  className={`h-full transition-all ${
                    index < currentIndex ? "bg-orange-400" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-base font-medium text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function CancelConfirmationDialog({ onConfirm, onCancel, isPending }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cancel this order?</h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Are you sure you want to cancel this order? Once cancelled, the order cannot be reactivated.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isPending ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = Boolean(location.state?.fromCheckout);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const { requireAuth } = useRequireAuth();

  const {
    data: order,
    isLoading,
    isError,
  } = useOrder(id);

  useInstantScrollToTop([id, isLoading, order?.id]);

  const {
    data: payment,
    isLoading: paymentLoading,
    isError: paymentError,
  } = useOrderPayment(id, {
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const method = query.state.data?.method;
      return method === "ONLINE" && status === "PENDING" ? 5000 : false;
    },
  });

  const cancelOrder = useCancelOrder();

  const handleCancelClick = () => {
    if (!requireAuth("/orders")) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    cancelOrder.mutate(Number(id), {
      onSuccess: () => {
        setShowCancelSuccess(true);
      },
    });
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
  };

  const isCancelled = order?.status === "CANCELLED" || showCancelSuccess;
  const canCancel = order?.status === "PENDING" && !isCancelled && !cancelOrder.isPending;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-3 text-sm font-medium text-red-800">Order not found</p>
          <p className="mt-1 text-sm text-red-600">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            to="/orders"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const itemsSubtotal = order.items?.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  ) || 0;

  const total = Number(order.totalAmount);

  const formattedDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const cancelledDate = order.cancelledAt
    ? new Date(order.cancelledAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const description = STATUS_DESCRIPTIONS[order.status] || "";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50 transition-colors"
              aria-label="Back to orders"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
               <h1 className="text-2xl font-medium text-gray-900 sm:text-3xl font-serif">
                Order Details
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Order {order.id} · {formattedDate}
              </p>
            </div>
          </div>
        </div>

        <OrderStatus status={order.status} className="text-sm" />
      </div>

      {justPlaced && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-emerald-800">Your order has been placed</p>
              <p className="text-sm text-emerald-700">
                Order {order.id} is confirmed. You can track its status below.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/products"
                  className="inline-flex rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Continue shopping
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  View my orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel success message */}
      {showCancelSuccess && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Order Cancelled</p>
              <p className="mt-1 text-sm text-green-700">
                Your order has been cancelled successfully.
                {cancelledDate && (
                  <span className="block mt-0.5">
                    Cancelled on {cancelledDate}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error from cancel mutation */}
      {cancelOrder.isError && !showCancelSuccess && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Cancellation Failed</p>
              <p className="mt-1 text-sm text-red-600">
                {getFriendlyError(cancelOrder.error, "Couldn't cancel this order.")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">Order Status</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <StatusTimeline currentStatus={order.status} />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Products & Shipping */}
        <div className="space-y-6 lg:col-span-2">
          {/* Products */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <SectionHeader icon={Package} title="Products" subtitle={`${order.items?.length || 0} items`} />
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const imageUrl = item.product?.imageUrl || item.product?.image;
                return (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product?.name || "Product"}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.product?.name || "Product"}
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${Number(item.price).toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <SectionHeader icon={MapPin} title="Shipping Address" />
            </div>

            <div className="px-6 py-5">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="grid gap-2 text-sm">
                  <p className="font-semibold text-gray-900">
                    {order.shippingName}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                  <p className="text-gray-600">
                    {order.shippingCity}, {order.shippingCountry}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-xs font-medium text-gray-500">Phone:</span>
                    <span className="text-xs">{order.shippingPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <SectionHeader icon={Package} title="Order Summary" />
            </div>

            <div className="space-y-3 px-6 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${itemsSubtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">${(total - itemsSubtotal).toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                   <span className="text-xl font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <SectionHeader icon={CreditCard} title="Payment" />
            </div>

            <div className="px-6 py-4">
              {paymentLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                </div>
              ) : paymentError ? (
                <div className="space-y-3">
                  <PaymentStatusBadge
                    method={order.paymentMethod || "COD"}
                    status={order.paymentStatus || "PENDING"}
                  />
                  <p className="text-xs text-gray-500">
                    {paymentStatusDescription[order.paymentStatus || "PENDING"]}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <PaymentStatusBadge
                    method={payment.method}
                    status={payment.status}
                  />

                  <p className="text-xs text-gray-600">
                    {paymentStatusDescription[payment.status]}
                  </p>

                  {payment.transactionId && (
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Transaction ID</p>
                      <p className="mt-0.5 break-all font-mono text-xs text-gray-700">
                        {payment.transactionId}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cancel Button */}
          {canCancel && (
            <button
              onClick={handleCancelClick}
              disabled={cancelOrder.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-700 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              <XCircle className="h-4 w-4" />
              {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

{/* Footer Actions */}
      <div className="flex items-center justify-center rounded-xl bg-white px-6 py-4 text-center">
        <div className="text-xs sm:text-sm text-gray-500 font-medium">
          {isCancelled && cancelledDate
            ? `Cancelled on ${cancelledDate}`
            : `Order placed on ${formattedDate}`}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showConfirmDialog && (
        <CancelConfirmationDialog
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelDialog}
          isPending={cancelOrder.isPending}
        />
      )}
    </div>
  );
}

export default OrderDetailsPage;
