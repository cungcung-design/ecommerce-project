import {
  paymentMethodLabels,
  paymentMethodColors,
  paymentStatusLabels,
  paymentStatusColors,
} from "../../validators/paymentValidator";

function PaymentStatusBadge({ method, status }) {
  const methodLabel = method ? (paymentMethodLabels[method] ?? method) : null;
  const methodColor = method ? (paymentMethodColors[method] ?? "bg-gray-100 text-gray-800") : "";

  const statusLabel = status ? (paymentStatusLabels[status] ?? status) : "Pending";
  const statusColor = status ? (paymentStatusColors[status] ?? "bg-gray-100 text-gray-800") : "bg-gray-100 text-gray-800";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {methodLabel && (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${methodColor}`}
          aria-label={`Payment method: ${methodLabel}`}
        >
          {methodLabel}
        </span>
      )}

      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
        aria-label={`Payment status: ${statusLabel}`}
      >
        {statusLabel}
      </span>
    </div>
  );
}

export default PaymentStatusBadge;
