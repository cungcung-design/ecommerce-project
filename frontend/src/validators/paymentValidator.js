export const paymentMethodLabels = {
  COD: "Cash on Delivery",
  ONLINE: "Online Payment",
};

export const paymentMethodColors = {
  COD: "bg-purple-100 text-purple-800",
  ONLINE: "bg-teal-100 text-teal-800",
};

export const paymentStatusLabels = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export const paymentStatusDescription = {
  PENDING:
    "Your payment is being processed. This will update automatically.",
  PAID: "Your payment has been completed successfully.",
  FAILED: "Your payment failed. Please try again.",
  REFUNDED: "Your payment has been refunded.",
};
