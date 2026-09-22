const MOBILE_SKELETON_COUNT = 6;
const DESKTOP_SKELETON_COUNT = 12;

function ProductSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="skeleton-shimmer aspect-[16/10] bg-gray-200 sm:aspect-[4/3]" />

      <div className="p-3 sm:p-4">
        <div className="skeleton-shimmer h-3 w-1/3 rounded bg-gray-200" />
        <div className="skeleton-shimmer mt-2 h-4 w-4/5 rounded bg-gray-200" />
        <div className="skeleton-shimmer mt-2 h-4 w-1/4 rounded bg-gray-200" />

        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="skeleton-shimmer h-3 w-3 rounded-sm bg-gray-200 sm:h-3.5 sm:w-3.5"
            />
          ))}
        </div>

        <div className="skeleton-shimmer mt-3 h-9 w-full rounded-lg bg-gray-200 sm:h-10" />
      </div>
    </div>
  );
}

function ProductSkeletonGrid() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading products</span>

      <div className="grid grid-cols-2 gap-6 sm:hidden">
        {Array.from({ length: MOBILE_SKELETON_COUNT }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>

      <div className="hidden gap-6 sm:grid sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: DESKTOP_SKELETON_COUNT }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default ProductSkeletonGrid;
