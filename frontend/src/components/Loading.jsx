function Loading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border p-4"
          >
            <div className="aspect-[3/4] rounded-lg bg-gray-200" />

            <div className="mt-4 h-5 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
          </div>
        )
      )}
    </div>
  );
}

export default Loading;
