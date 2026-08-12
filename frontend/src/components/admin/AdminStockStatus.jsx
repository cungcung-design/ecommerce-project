export default function AdminStockStatus({
  stock,
}) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-600 border border-red-200">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="rounded-full bg-yellow-50 px-3 py-1 text-sm text-yellow-700 border border-yellow-200">
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-600 border border-green-200">
      {stock} in stock
    </span>
  );
}
