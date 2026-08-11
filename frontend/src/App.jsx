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
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import CreateProduct from "./pages/admin/CreateProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminUserPage from "./pages/admin/AdminUserPage";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage";

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
            element={<CartPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />

            <Route
              path="/payment/result"
              element={<PaymentResultPage />}
            />

            <Route
              path="/orders"
              element={<MyOrdersPage />}
            />

            <Route
              path="/orders/:id"
              element={<OrderDetailsPage />}
            />
          </Route>
     
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminDashboard />}
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
                element={<AdminEditProduct />}
              />

              <Route
                path="orders"
                element={<AdminOrders />}
              />

              <Route
                path="orders/:id"
                element={<AdminOrderDetailsPage />}
              />

              <Route
                path="users"
                element={<AdminUserPage />}
              />

              <Route
                path="categories"
                element={<AdminCategoryPage />}
              />
            </Route>
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
