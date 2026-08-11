import { statusLabels, statusColors } from "../../validators/adminOrderValidator";

function OrderStatus({ status, className = "" }) {
  const label = statusLabels[status] ?? status;
  const colorClass = statusColors[status] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colorClass} ${className}`}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}

export default OrderStatus;
