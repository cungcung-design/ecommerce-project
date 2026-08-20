import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Mail, Lock, Loader2, AlertCircle, ShoppingBag } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import useNotification from "../hooks/useNotification";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();
  const { notify } = useNotification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
    }
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      notify.success(`Welcome back, ${loggedInUser.name}!`);

      if (loggedInUser.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
    } catch (error) {
      notify.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-serif">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div className="text-sm font-medium">
              <ErrorMessage message={error} />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                required
              />
            </div>
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 p-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            {loading ? (
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