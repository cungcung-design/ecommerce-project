import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from "react";

import { ToastContainer } from "../components/notifications/ToastContainer";
import { ConfirmDialog } from "../components/notifications/ConfirmDialog";
import { isTechnicalMessage } from "../lib/getFriendlyError";

const NotificationContext = createContext(null);

let toastId = 0;
const RECENT_TOAST_WINDOW = 2000;

const DEFAULT_DURATION = {
  success: 3000,
  info: 3000,
  warning: 4000,
  error: 5000,
};

const sanitizeMessage = (message) => {
  if (typeof message !== "string" || !message.trim()) {
    return "Something went wrong. Please try again.";
  }
  if (isTechnicalMessage(message)) {
    return "Something went wrong. Please try again.";
  }
  return message.trim();
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
      duration = options?.duration ?? DEFAULT_DURATION[variant] ?? 3000;
      action = options?.action;
    } else {
      variant = messageOrOptions?.variant || "info";
      message = sanitizeMessage(messageOrOptions?.message);
      duration = messageOrOptions?.duration ?? DEFAULT_DURATION[variant] ?? 3000;
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
        recentRef.current.delete(key);
      }, duration);
    }
    return id;
  }, []);

  const notify = useMemo(() => {
    const fn = (messageOrOptions, options) => showToast(messageOrOptions, options);
    fn.success = (message, options) => showToast({ message, variant: "success", ...options });
    fn.error = (message, options) => showToast({ message, variant: "error", ...options });
    fn.warning = (message, options) => showToast({ message, variant: "warning", ...options });
    fn.info = (message, options) => showToast({ message, variant: "info", ...options });
    return fn;
  }, [showToast]);

  const success = notify.success;
  const error = notify.error;
  const warning = notify.warning;
  const info = notify.info;

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
