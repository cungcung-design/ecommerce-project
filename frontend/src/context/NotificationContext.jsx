import { createContext, useContext, useState, useCallback, useEffect } from "react";

import ToastContainer from "../components/notifications/ToastContainer";
import ConfirmDialog from "../components/notifications/ConfirmDialog";

const NotificationContext = createContext(null);

let toastId = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((messageOrOptions, options) => {
    let message, variant, duration, action;

    if (typeof messageOrOptions === "string") {
      message = messageOrOptions;
      variant = options?.variant || "info";
      duration = options?.duration ?? 4000;
      action = options?.action;
    } else {
      message = messageOrOptions.message;
      variant = messageOrOptions.variant || "info";
      duration = messageOrOptions.duration ?? 4000;
      action = messageOrOptions.action;
    }

    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant, duration, action }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const notify = useCallback((messageOrOptions, options) => {
    return toast(messageOrOptions, options);
  }, [toast]);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        title: options.title || "Confirm",
        message: options.message || "",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        variant: options.variant || "default",
        resolve,
      });
    });
  }, []);

  const handleConfirmClose = useCallback((result) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  }, [confirmState]);

  useEffect(() => {
    if (!confirmState) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleConfirmClose(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmState, handleConfirmClose]);

  return (
    <NotificationContext.Provider value={{ toast: notify, notify, confirm }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          onClose={handleConfirmClose}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
