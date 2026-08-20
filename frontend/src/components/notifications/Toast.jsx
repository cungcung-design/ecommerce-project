import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const variantConfig = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-500",
    icon: CheckCircle,
    progressColor: "#10b981",
    textColor: "text-emerald-900",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-500",
    icon: XCircle,
    progressColor: "#ef4444",
    textColor: "text-red-900",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-500",
    icon: AlertTriangle,
    progressColor: "#f59e0b",
    textColor: "text-amber-900",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-500",
    icon: Info,
    progressColor: "#3b82f6",
    textColor: "text-blue-900",
  },
};

function Toast({ toast, onDismiss }) {
  const { message, variant = "info", duration = 4000, action } = toast;
  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.icon;
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const step = 50;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
      }
    }, step);

    return () => clearInterval(intervalRef.current);
  }, [duration]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onDismiss, 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      className={`pointer-events-auto group relative overflow-hidden rounded-xl border ${config.border} ${config.bg} shadow-lg toast-enter ${isExiting ? "toast-exit" : ""}`}
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      aria-live={variant === "error" || variant === "warning" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3 p-3 sm:p-4">
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-xs sm:text-sm font-semibold ${config.textColor} break-words`}>{message}</p>
          {action && (
            <button
              onClick={action.onClick}
               className="mt-2 inline-flex items-center rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors"
            >
              {action.text}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%`, backgroundColor: config.progressColor }}
        />
      )}
    </div>
  );
}

export default Toast;
