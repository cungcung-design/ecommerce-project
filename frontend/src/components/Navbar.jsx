import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";

function Navbar() {
  const { user, logout } = useAuth();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-xl font-bold"
        >
          MyStore
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart" className="relative">
            Cart
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-black px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders">
                Orders
              </Link>

              {user.role === "ADMIN" && (
                <Link to="/admin">
                  Admin
                </Link>
              )}

              <span className="text-sm">
                Hi, {user.name}
              </span>

              <button
                onClick={logout}
                className="rounded-lg border px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;