import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            NovaTrend
          </Link>

          <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-orange-600 transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-orange-600 transform scale-x-100 group-hover:scale-x-100 transition-transform"></span>
              </Link>
            <Link to="/products" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Shop
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-orange-600 transition-colors">
              New Arrivals
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Best Sellers
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Categories
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-orange-600 transition-colors">
              About
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Blog
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block hover:text-orange-600 transition-colors" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button className="hidden sm:block hover:text-orange-600 transition-colors" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {user ? (
              <>
                <Link to="/orders" className="hidden sm:block hover:text-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                {user.role === "ADMIN" && (
                  <Link to="/admin" className="hidden sm:block hover:text-orange-600 transition-colors">
                    Admin
                  </Link>
                )}

                <button onClick={logout} className="hidden sm:block text-sm font-medium hover:text-orange-600 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block hover:text-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                <Link to="/register" className="hidden sm:block text-sm font-medium hover:text-orange-600 transition-colors">
                  Register
                </Link>
              </>
            )}

            <Link to="/cart" className="relative hover:text-orange-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-4 space-y-3">
            <Link to="/" className="block text-sm font-medium hover:text-orange-600">Home</Link>
            <Link to="/products" className="block text-sm font-medium hover:text-orange-600">Shop</Link>
            <Link to="/products" className="block text-sm font-medium hover:text-orange-600">New Arrivals</Link>
            <Link to="/products" className="block text-sm font-medium hover:text-orange-600">Best Sellers</Link>
            <Link to="/products" className="block text-sm font-medium hover:text-orange-600">Categories</Link>
            <Link to="/" className="block text-sm font-medium hover:text-orange-600">About</Link>
            <Link to="/" className="block text-sm font-medium hover:text-orange-600">Blog</Link>
            <Link to="/" className="block text-sm font-medium hover:text-orange-600">Contact</Link>

            <div className="flex gap-4 pt-2">
              <button className="hover:text-orange-600" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="hover:text-orange-600" aria-label="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/orders" className="text-sm font-medium">Orders</Link>
                {user.role === "ADMIN" && (
                  <Link to="/admin" className="text-sm font-medium">Admin</Link>
                )}
                <button onClick={logout} className="text-sm font-medium text-left">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/login" className="text-sm font-medium">Login</Link>
                <Link to="/register" className="text-sm font-medium">Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>
  );
}

export default Navbar;
