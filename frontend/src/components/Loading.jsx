function Loading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border p-4"
          >
            <div className="h-48 rounded-lg bg-gray-200" />

            <div className="mt-4 h-5 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
          </div>
        )
      )}
    </div>
  );
}

export default Loading;
