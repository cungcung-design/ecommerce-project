function Loading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
      {Array.from({ length: 12 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border p-3 sm:p-4"
          >
            <div className="aspect-square sm:aspect-[3/4] rounded-lg bg-gray-200" />

            <div className="mt-3 sm:mt-4 h-4 sm:h-5 rounded bg-gray-200" />

            <div className="mt-2 sm:mt-3 h-3 sm:h-4 w-1/2 rounded bg-gray-200" />
          </div>
        )
      )}
    </div>
  );
}

export default Loading;
