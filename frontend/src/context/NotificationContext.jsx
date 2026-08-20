import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

import { ToastContainer } from "../components/notifications/ToastContainer";
import { ConfirmDialog } from "../components/notifications/ConfirmDialog";

const NotificationContext = createContext(null);

let toastId = 0;
const RECENT_TOAST_WINDOW = 2000;
const recentToasts = new Map();

const sanitizeMessage = (message) => {
  if (typeof message !== "string") return "Something went wrong. Please try again.";
  if (!message.trim()) return "Something went wrong. Please try again.";
  return message;
};

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const recentRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((messageOrOptions, options) => {
    let message, variant, duration, action;

    if (typeof messageOrOptions === "string") {
      message = sanitizeMessage(messageOrOptions);
      variant = options?.variant || "info";
      duration = options?.duration ?? 4000;
      action = options?.action;
    } else {
      message = sanitizeMessage(messageOrOptions?.message);
      variant = messageOrOptions?.variant || "info";
      duration = messageOrOptions?.duration ?? 4000;
      action = messageOrOptions?.action;
    }

    const key = `${variant}:${message}`;
    const now = Date.now();
    const last = recentRef.current.get(key);

    if (last && now - last < RECENT_TOAST_WINDOW) {
      return null;
    }

    recentRef.current.set(key, now);
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant, duration, action }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
        recentRef.current.delete(key);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = useCallback((messageOrOptions, options) => {
    return showToast(messageOrOptions, options);
  }, [showToast]);

  const notify = useCallback((messageOrOptions, options) => {
    return toast(messageOrOptions, options);
  }, [toast]);

  const success = useCallback((message, options) => {
    return showToast({ message, variant: "success", ...options });
  }, [showToast]);

  const error = useCallback((message, options) => {
    return showToast({ message, variant: "error", ...options });
  }, [showToast]);

  const warning = useCallback((message, options) => {
    return showToast({ message, variant: "warning", ...options });
  }, [showToast]);

  const info = useCallback((message, options) => {
    return showToast({ message, variant: "info", ...options });
  }, [showToast]);

  notify.success = success;
  notify.error = error;
  notify.warning = warning;
  notify.info = info;

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
    <NotificationContext.Provider value={{ toast: notify, notify, confirm, success, error, warning, info }}>
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
