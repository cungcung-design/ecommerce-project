import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onClose,
}) {
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();
  }, []);

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => onClose(false)} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="confirm-dialog-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={() => onClose(true)}
            className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25"
                : "bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/25"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
