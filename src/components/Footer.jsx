import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

import { openWhatsApp } from "../utils/whatsapp";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">

      <div className="container footer-main">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark">A</span>

            <span className="brand-text">
              <strong>Alankruti</strong>
              <small>CRAFTS</small>
            </span>
          </Link>

          <p>
            Thoughtfully crafted products made to bring
            warmth, beauty and character into everyday life.
          </p>

          <button
            type="button"
            className="footer-whatsapp"
            onClick={() =>
              openWhatsApp(
                "Hello Alankruti Crafts, I need some help."
              )
            }
          >
            <MessageCircle size={17} />
            Chat on WhatsApp
          </button>
        </div>

        {/* Shop */}
        <div className="footer-column">
          <h4>Shop</h4>

          <Link to="/products">
            All Products
          </Link>

          <Link to="/products?category=handmade">
            Handmade
          </Link>

          <Link to="/products?category=decor">
            Home Decor
          </Link>

          <Link to="/products?category=gifts">
            Gifts
          </Link>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h4>Customer</h4>

          <Link to="/orders">
            My Orders
          </Link>

          <Link to="/profile">
            My Profile
          </Link>

          <Link to="/support">
            Support
          </Link>

          <Link to="/checkout">
            Cart
          </Link>
        </div>

        {/* Social */}
        <div className="footer-column">
          <h4>Follow Us</h4>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={17} />
            Instagram
            <ArrowUpRight size={14} />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook size={17} />
            Facebook
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <div className="container footer-bottom">

        <p>
          © {currentYear} Alankruti Crafts. All rights reserved.
        </p>

        <p>
          Handmade with care.
        </p>
      </div>
    </footer>
  );
};

export default Footer;