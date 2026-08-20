import Toast from "./Toast";

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      className="pointer-events-none fixed top-20 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 sm:w-full sm:max-w-md"
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
