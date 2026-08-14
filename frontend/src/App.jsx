import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminOrderPage from "./pages/admin/AdminOrderPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminCreateProductPage from "./pages/admin/AdminCreateProductPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminUserPage from "./pages/admin/AdminUserPage";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage";

import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>

          {/* Public & Customer routes (with Navbar/Footer + max-w container) */}
          <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetailsPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
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

          </Route>

          {/* Admin routes (full-width, outside MainLayout) */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminDashboardPage />}
              />

              <Route
                path="products"
                element={<AdminProductPage />}
              />

              <Route
                path="products/create"
                element={<AdminCreateProductPage />}
              />

              <Route
                path="products/:id/edit"
                element={<AdminEditProductPage />}
              />

              <Route
                path="orders"
                element={<AdminOrderPage />}
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

        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;