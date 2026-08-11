import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div>
        <h2 className="text-lg font-semibold">
          Welcome, {user?.name}
        </h2>

        <p className="text-sm text-gray-500">
          {user?.email}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="rounded-lg border px-4 py-2 text-sm"
        >
          View Store
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminTopbar;
