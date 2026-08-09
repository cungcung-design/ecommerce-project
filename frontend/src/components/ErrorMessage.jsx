function ErrorMessage({
  message = "Something went wrong.",
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
      <h2 className="font-semibold">
        Something went wrong
      </h2>

      <p className="mt-2 text-sm">
        {message}
      </p>
    </div>
  );
}

export default ErrorMessage;
