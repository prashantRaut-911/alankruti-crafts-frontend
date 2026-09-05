import {
  Navigate,
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
          ADMIN PANEL
          
          Temporarily disabled.
          We will enable these routes
          after the Admin Panel is built.
      ========================== */}

      {/* 
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route
          index
          element={
            <Navigate
              to="/admin/products"
              replace
            />
          }
        />

        <Route
          path="products"
          element={<ProductManagement />}
        />

        <Route
          path="products/new"
          element={<AddProduct />}
        />

        <Route
          path="products/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="orders"
          element={<OrderManagement />}
        />

        <Route
          path="customers"
          element={<CustomerManagement />}
        />
      </Route>
      */}

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

