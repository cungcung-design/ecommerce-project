export default function AdminStockStatus({
  stock,
}) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
      {stock} in stock
    </span>
  );
}
