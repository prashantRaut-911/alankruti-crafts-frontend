import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerSupport from "./pages/CustomerSupport";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import OrderManagement from "./pages/admin/OrderManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";

import ProtectedRoute from "./components/ProtectedRoute";

function StoreLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>

      {/* =========================
          CUSTOMER ROUTES
      ========================== */}

      <Route
        path="/"
        element={
          <StoreLayout>
            <Home />
          </StoreLayout>
        }
      />

      <Route
        path="/products"
        element={
          <StoreLayout>
            <Products />
          </StoreLayout>
        }
      />

      <Route
        path="/products/:id"
        element={
          <StoreLayout>
            <ProductDetails />
          </StoreLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <StoreLayout>
            <Checkout />
          </StoreLayout>
        }
      />

      <Route
        path="/order-success/:id"
        element={
          <StoreLayout>
            <OrderSuccess />
          </StoreLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <StoreLayout>
            <OrderHistory />
          </StoreLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <StoreLayout>
            <CustomerProfile />
          </StoreLayout>
        }
      />

      <Route
        path="/support"
        element={
          <StoreLayout>
            <CustomerSupport />
          </StoreLayout>
        }
      />

      {/* =========================
          ADMIN LOGIN
      ========================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* =========================
          PROTECTED ADMIN ROUTES
      ========================== */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route
          index
          element={
            <AdminDashboard />
          }
        />

        <Route
          path="products"
          element={
            <ProductManagement />
          }
        />

        <Route
          path="products/new"
          element={
            <AddProduct />
          }
        />

        <Route
          path="products/:id/edit"
          element={
            <EditProduct />
          }
        />

        <Route
          path="orders"
          element={
            <OrderManagement />
          }
        />

        <Route
          path="customers"
          element={
            <CustomerManagement />
          }
        />
      </Route>

      {/* =========================
          FALLBACK
      ========================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}