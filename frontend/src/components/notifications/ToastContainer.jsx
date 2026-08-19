import Toast from "./Toast";

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 sm:left-auto sm:right-4 sm:max-w-md w-[calc(100%-2rem)] max-w-sm mx-auto left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 sm:w-full sm:max-w-md"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
