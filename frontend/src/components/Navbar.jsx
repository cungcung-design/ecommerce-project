import { useState, useEffect, useLayoutEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  Package,
  ShoppingCart,
  User,
  ChevronDown,
  X,
  Menu,
  ShieldCheck,
  LogOut,
  ShoppingBag
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import useNotification from "../hooks/useNotification";
import { useRequireAuth } from "../hooks/useRequireAuth";

const ACTION_REQUIRED_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: cart } = useCart({ enabled: !!user });
  const { data: orders } = useOrders();
  const { notify } = useNotification();

  // Add scroll effect for glassmorphism styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  }, [location.pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const hasActionRequired = orders?.some((order) =>
    ACTION_REQUIRED_STATUSES.includes(order.status)
  );

  const handleLogout = async () => {
    await logout();
    notify.success("Logged out successfully");
    setIsAccountOpen(false);
    setIsMenuOpen(false);
  };

  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const sort = searchParams.get("sort");
  const category = searchParams.get("category");
  const hash = location.hash;

  const { requireAuth } = useRequireAuth("wishlist");

  const isHomeActive = pathname === "/" && hash !== "#new-arrivals";
  const isShopActive = pathname === "/products" && !sort && !category;
  const isNewArrivalsActive = hash === "#new-arrivals" || sort === "newest";
  const isBestSellersActive = hash === "#best-sellers" || sort === "best-selling";
  const isCategoriesActive = hash === "#categories" || Boolean(category);

  const getNavLinkClass = (isActive) =>
    `text-sm font-medium transition-colors relative py-1 ${
      isActive ? "text-orange-600 font-semibold" : "text-slate-600 hover:text-orange-600"
    }`;

  const underlineClass = "after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:bg-orange-600 after:rounded-full after:transition-all";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm" 
        : "bg-white border-b border-slate-100"
    }`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform sm:w-9 sm:h-9">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span>Nova<span className="text-orange-600">Trend</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-8 mx-8">
          <NavLink to="/" end className={`${getNavLinkClass(isHomeActive)} ${isHomeActive ? underlineClass : ""}`}>
            Home
          </NavLink>
          <NavLink to="/products" className={`${getNavLinkClass(isShopActive)} ${isShopActive ? underlineClass : ""}`}>
            Shop
          </NavLink>
          <NavLink to="/#new-arrivals" className={`${getNavLinkClass(isNewArrivalsActive)} ${isNewArrivalsActive ? underlineClass : ""}`}>
            New Arrivals
          </NavLink>
          <NavLink to="/#best-sellers" className={`${getNavLinkClass(isBestSellersActive)} ${isBestSellersActive ? underlineClass : ""}`}>
            Best Sellers
          </NavLink>
          <NavLink to="/#categories" className={`${getNavLinkClass(isCategoriesActive)} ${isCategoriesActive ? underlineClass : ""}`}>
            Categories
          </NavLink>
        </div>

        {/* Action Icons Section */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to="/products"
            className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-100/80 transition-all"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => requireAuth("/products")}
            className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-100/80 transition-all"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </button>

          {user && (
            <Link
              to="/orders"
              className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-100/80 transition-all relative"
              aria-label="Orders"
            >
              <Package className="h-5 w-5" />
              {hasActionRequired && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-orange-600 ring-2 ring-white animate-pulse" aria-label="Action required on orders" />
              )}
            </Link>
          )}

          <Link
            to="/cart"
            className="relative p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-100/80 transition-all"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account Dropdown (Desktop) */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-1.5 p-1.5 pl-2.5 rounded-xl border border-slate-200/80 hover:border-orange-200 hover:bg-orange-50/50 transition-all text-slate-700"
                aria-label="Account"
              >
                <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                  {user.name?.[0] || user.email?.[0] || "U"}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isAccountOpen ? "rotate-180 text-orange-600" : ""}`} />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email || user.name}</p>
                  </div>
                  
                  <Link
                    to="/orders"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 rounded-xl transition-colors"
                  >
                    <Package className="h-4 w-4 text-slate-400" />
                    Orders
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 rounded-xl transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-slate-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-md shadow-orange-500/20 transition-all"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 sm:px-5 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="space-y-1">
            <NavLink to="/" end className={`block px-3 py-2 rounded-xl text-base font-semibold transition-colors ${isHomeActive ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"}`} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/products" className={`block px-3 py-2 rounded-xl text-base font-semibold transition-colors ${isShopActive ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"}`} onClick={() => setIsMenuOpen(false)}>Shop</NavLink>
            <NavLink to="/#new-arrivals" className={`block px-3 py-2 rounded-xl text-base font-semibold transition-colors ${isNewArrivalsActive ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"}`} onClick={() => setIsMenuOpen(false)}>New Arrivals</NavLink>
            <NavLink to="/#best-sellers" className={`block px-3 py-2 rounded-xl text-base font-semibold transition-colors ${isBestSellersActive ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"}`} onClick={() => setIsMenuOpen(false)}>Best Sellers</NavLink>
            <NavLink to="/#categories" className={`block px-3 py-2 rounded-xl text-base font-semibold transition-colors ${isCategoriesActive ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"}`} onClick={() => setIsMenuOpen(false)}>Categories</NavLink>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          <div className="grid grid-cols-2 gap-2">
            <NavLink to="/products" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200/80 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
              <Search className="h-4 w-4 text-slate-400" />
              Search
            </NavLink>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  requireAuth("/products");
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200/80 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
              <Heart className="h-4 w-4 text-slate-400" />
              Wishlist
            </button>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {user ? (
            <div className="space-y-1.5">
              <NavLink to="/orders" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center gap-2.5">
                  <Package className="h-4 w-4 text-slate-400" />
                  Orders
                </div>
                {hasActionRequired && (
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-600 animate-pulse" aria-label="Action required on orders" />
                )}
              </NavLink>

              {user.role === "ADMIN" && (
                <NavLink to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  Admin Dashboard
                </NavLink>
              )}

              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 text-left transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <NavLink to="/login" className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="flex items-center justify-center py-2.5 rounded-xl bg-orange-600 text-sm font-semibold text-white shadow-md shadow-orange-500/20" onClick={() => setIsMenuOpen(false)}>Register</NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;