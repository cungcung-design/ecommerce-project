import { NavLink } from "react-router-dom";

function AdminSidebar({ mobileOpen = false, onClose = () => {} }) {
  const navLinkClass = ({ isActive }) =>
    `block rounded-lg p-3 text-white/70 hover:bg-blue-500/10 hover:text-white transition-colors ${
      isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : ""
    }`;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: static on desktop, slide-in drawer on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-white/10 bg-slate-900 p-6 transition-transform duration-200 md:static md:flex md:translate-x-0 ${
          mobileOpen ? "flex translate-x-0" : "flex -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            <span className="text-blue-500">Admin</span> Panel
          </h1>

          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          <NavLink to="/admin" end className={navLinkClass} onClick={onClose}>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={navLinkClass}
            onClick={onClose}
          >
            Products
          </NavLink>

          <NavLink to="/admin/orders" className={navLinkClass} onClick={onClose}>
            Orders
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={navLinkClass}
            onClick={onClose}
          >
            Categories
          </NavLink>

          <NavLink to="/admin/users" className={navLinkClass} onClick={onClose}>
            Users
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;