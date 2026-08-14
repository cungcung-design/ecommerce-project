import Toast from "./Toast";

function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      className="fixed top-4 left-4 right-4 z-[9999] flex flex-col gap-3 sm:left-auto sm:right-4 sm:max-w-md"
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

export default ToastContainer;
