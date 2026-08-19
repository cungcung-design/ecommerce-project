import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useOrderPayment } from "../hooks/usePayment";
import useNotification from "../hooks/useNotification";

import PaymentStatusBadge from "../components/payments/PaymentStatusBadge";
import { paymentStatusDescription } from "../validators/paymentValidator";

const terminalStatuses = ["PAID", "FAILED", "REFUNDED"];

function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify } = useNotification();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const orderId = searchParams.get("orderId");

  const {
    data: payment,
    isLoading,
    isError,
    error,
  } = useOrderPayment(orderId, {
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return terminalStatuses.includes(status) ? false : 5000;
    },
    retry: 3,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        <p className="mt-4 text-gray-600">
          Verifying your payment status...
        </p>
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-xl border bg-red-50 p-6 text-center">
          <h1 className="text-xl font-bold text-red-700">
            Unable to load payment
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {error?.response?.data?.message ||
              error?.message ||
              "Payment information could not be retrieved."}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm font-medium text-white"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const { status, method } = payment;
  const isSuccess = status === "PAID";
  const isFailed = status === "FAILED" || status === "REFUNDED";

  useEffect(() => {
    if (!payment || terminalStatuses.includes(status)) {
      if (status === "PAID") {
        notify.success("Payment successful! Your order is confirmed.");
      } else if (status === "FAILED" || status === "REFUNDED") {
        notify.error("Payment failed. Please try again or choose a different payment method.");
      }
    }
  }, [status, payment, notify]);

  const handleBackToOrders = () => {
    navigate("/orders");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-xl border bg-white p-6 text-center sm:p-10">
        {isSuccess ? (
          <div className="flex justify-center">
            <svg
              className="h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m0 6h.01M5.06 19.06A9 9 0 1112 21a9 9 02 0-2.94z"
              />
            </svg>
          </div>
        ) : (
          <div className="flex justify-center">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold">
          {isSuccess
            ? "Payment Successful"
            : isFailed
              ? "Payment Failed"
              : "Verifying Payment..."}
        </h1>

        <div className="mt-4 mb-6 flex justify-center">
          <PaymentStatusBadge method={method} status={status} />
        </div>

        <p className="text-sm text-gray-600">
          {paymentStatusDescription[status]}
        </p>

        {payment.transactionId && (
          <p className="mt-3 text-xs text-gray-400 break-all">
            Reference: {payment.transactionId}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {isSuccess ? (
            <Link
              id="view-order-link"
              to={`/orders/${payment.orderId}`}
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white"
            >
              View Order Details
            </Link>
          ) : (
            <Link
              to="/checkout"
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white"
            >
              Try Again
            </Link>
          )}

          <button
            type="button"
            onClick={handleBackToOrders}
            className="rounded-lg border px-6 py-3 text-sm font-medium"
          >
            Back to My Orders
          </button>
        </div>

        {!terminalStatuses.includes(status) && (
          <p className="mt-6 text-xs text-gray-400">
            We are verifying your payment. This page will update
            automatically.
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentResultPage;
