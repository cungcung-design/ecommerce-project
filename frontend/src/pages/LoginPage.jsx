import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Mail, Lock, Loader2, AlertCircle, ShoppingBag } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import useNotification from "../hooks/useNotification";
import { getFriendlyError, isNetworkError } from "../lib/getFriendlyError";
import { loginSchema } from "../validators/authValidator";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();
  const { notify } = useNotification();

  const redirectTo = searchParams.get("redirectTo") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
    }
  }, [user, navigate, redirectTo]);

  const onSubmit = async ({ email, password }) => {
    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
    } catch (error) {
      if (isNetworkError(error)) {
        notify.error("Unable to connect. Please try again.");
        return;
      }

      setError("root", {
        message:
          error.response?.status === 401 || error.response?.status === 400
            ? "Invalid email or password."
            : getFriendlyError(error, "Invalid email or password."),
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5">
        
        {/* Header / Brand Icon */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-600/25">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
             <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight font-serif">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        {errors.root && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <p className="text-sm font-medium">{errors.root.message}</p>
          </div>
        )}

        {/* Form */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-rose-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 p-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;