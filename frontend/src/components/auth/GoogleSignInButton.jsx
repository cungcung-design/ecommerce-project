import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getFriendlyError, isNetworkError } from "../../lib/getFriendlyError";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c6.1 0 8.6-4.3 8.6-6.5 0-.4 0-.8-.1-1.1H12z" />
      <path fill="#34A853" d="M3.7 7.5l3.2 2.3C7.7 8 9.7 6.5 12 6.5c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 8.2 2.4 4.9 4.6 3.7 7.5z" />
      <path fill="#FBBC05" d="M12 20.8c2.5 0 4.7-.8 6.2-2.3l-2.9-2.4c-.8.6-1.9 1.1-3.3 1.1-3.9 0-5.3-2.5-5.5-3.8l-3.2 2.5c1.2 2.8 4.4 4.9 8.7 4.9z" />
      <path fill="#4285F4" d="M20.6 14.3c.1-.4.2-.8.2-1.1 0-.4 0-.8-.1-1.1H12v3.9h5.5c-.3 1.4-1.1 2.4-2.2 3.1l2.9 2.4c1.7-1.6 2.8-3.9 2.4-7.2z" />
    </svg>
  );
}

function GoogleButton({ disabled, pending, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleMark />}
      <span>{pending ? "Connecting..." : "Continue with Google"}</span>
    </button>
  );
}

function GoogleSignInButtonInner({ onSuccess, onError, disabled }) {
  const { loginWithGoogle } = useAuth();
  const [pending, setPending] = useState(false);

  const startGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      if (!response.code) {
        onError("Google sign-in failed. Please try again.");
        return;
      }

      setPending(true);

      try {
        const user = await loginWithGoogle(response.code);
        onSuccess(user);
      } catch (error) {
        onError(
          isNetworkError(error)
            ? "Unable to connect. Please try again."
            : getFriendlyError(error, "Google sign-in failed. Please try again.")
        );
      } finally {
        setPending(false);
      }
    },
    onError: (error) => {
      const code = error?.error || error?.type || "";

      if (code === "popup_closed_by_user" || code === "access_denied" || code === "popup_closed") {
        onError("Google sign-in was cancelled.");
        return;
      }

      onError("Google sign-in failed. Please try again.");
    },
  });

  return (
    <GoogleButton
      disabled={disabled}
      pending={pending}
      onClick={() => startGoogleLogin()}
    />
  );
}

function GoogleSignInButton({ onSuccess, onError, disabled }) {
  if (!googleClientId) {
    return (
      <GoogleButton
        disabled={disabled}
        pending={false}
        onClick={() => onError("Google sign-in is not configured.")}
      />
    );
  }

  return (
    <GoogleSignInButtonInner
      onSuccess={onSuccess}
      onError={onError}
      disabled={disabled}
    />
  );
}

export default GoogleSignInButton;
