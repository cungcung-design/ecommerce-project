import { Link } from "react-router-dom";

function formatPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "";
  }

  return `$${amount.toFixed(2)}`;
}

export default function AIProductCards({ products }) {
  if (!products?.length) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-medium text-slate-500">{products.length} product{products.length === 1 ? "" : "s"} found</p>
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 hover:border-orange-200"
        >
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="text-xs text-slate-500">{formatPrice(product.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
