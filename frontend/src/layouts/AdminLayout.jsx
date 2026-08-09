import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white p-6">
          <h1 className="text-xl font-bold">
            Admin Panel
          </h1>

          <nav className="mt-8 space-y-2">
            <NavLink
              to="/admin"
              end
              className="block rounded-lg p-3 hover:bg-gray-100"
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className="block rounded-lg p-3 hover:bg-gray-100"
            >
              Products
            </NavLink>

            <NavLink
              to="/admin/orders"
              className="block rounded-lg p-3 hover:bg-gray-100"
            >
              Orders
            </NavLink>

            <NavLink
              to="/admin/customers"
              className="block rounded-lg p-3 hover:bg-gray-100"
            >
              Customers
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
