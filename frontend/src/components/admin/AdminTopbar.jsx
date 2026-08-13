import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminTopbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-blue-500/10 hover:text-blue-600 md:hidden"
          aria-label="Open menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Welcome, {user?.name}
          </h2>

          <p className="text-sm text-white/50">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-blue-500/10 hover:text-white"
        >
          View Store
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 hover:bg-blue-400"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminTopbar;