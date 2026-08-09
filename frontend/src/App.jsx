import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";
import Customers from "./pages/admin/Customers";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />
          </Route>
    
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<Dashboard />}
              />

              <Route
                path="products"
                element={<AdminProducts />}
              />

              <Route
                path="products/create"
                element={<CreateProduct />}
              />

              <Route
                path="products/:id/edit"
                element={<EditProduct />}
              />

              <Route
                path="orders"
                element={<AdminOrders />}
              />

              <Route
                path="orders/:id"
                element={<AdminOrderDetails />}
              />

              <Route
                path="customers"
                element={<Customers />}
              />
            </Route>
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;