import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { admin, logout } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="site-header">
      <div className="container navbar">

        {/* Logo */}
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">A</span>

          <span className="brand-text">
            <strong>Alankruti</strong>
            <small>CRAFTS</small>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>

          <NavLink to="/support" className={navLinkClass}>
            Support
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">

          {/* Cart */}
          <Link
            to="/checkout"
            className="cart-button"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin */}
          {admin && (
            <Link
              to="/admin"
              className="admin-nav-button"
              title="Admin Dashboard"
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-nav">
          <div className="container mobile-nav-inner">

            <NavLink
              to="/"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Shop
            </NavLink>

            <NavLink
              to="/support"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Support
            </NavLink>

            {admin && (
              <>
                <NavLink
                  to="/admin"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </NavLink>

                <button
                  type="button"
                  className="mobile-logout"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;