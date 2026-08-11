import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-6">
      <h1 className="text-xl font-bold">
        Admin Panel
      </h1>

      <nav className="mt-8 space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `block rounded-lg p-3 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `block rounded-lg p-3 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `block rounded-lg p-3 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `block rounded-lg p-3 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block rounded-lg p-3 hover:bg-gray-100 ${isActive ? "bg-gray-100" : ""}`
          }
        >
          Users
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
