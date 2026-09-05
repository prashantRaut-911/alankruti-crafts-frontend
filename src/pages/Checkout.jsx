import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import { validateCheckout } from "../utils/validation";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors =
      validateCheckout(form);

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },

        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };

      const response =
        await createOrder(orderData);

      const order =
        response.data?.order;

      clearCart();

      navigate(
        `/order-success/${order._id}`,
        {
          state: {
            order,
          },
        }
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to place your order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="empty-cart-page">

        <div className="container">

          <div className="empty-cart">

            <div className="empty-cart-icon">
              <ShoppingBag size={30} />
            </div>

            <h1>Your cart is empty</h1>

            <p>
              Discover something beautiful and
              add it to your collection.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Explore Products
            </Link>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="container">

        {/* Header */}
        <div className="checkout-header">

          <Link
            to="/products"
            className="breadcrumb"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <h1>
            Your order
          </h1>

          <p>
            Review your items and enter your
            delivery details.
          </p>

        </div>

        <div className="checkout-grid">

          {/* ================= CUSTOMER FORM ================= */}
          <div className="checkout-form-card">

            <div className="checkout-card-heading">
              <span>01</span>

              <div>
                <h2>Delivery details</h2>
                <p>
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="checkout-form"
            >

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">
                  Full Name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

                {errors.name && (
                  <span className="form-error">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone">
                  Mobile Number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />

                {errors.phone && (
                  <span className="form-error">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address">
                  Address *
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows="4"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat / Street / Area"
                />

                {errors.address && (
                  <span className="form-error">
                    {errors.address}
                  </span>
                )}
              </div>

              {/* City + State */}
              <div className="form-grid-2">

                <div className="form-group">
                  <label htmlFor="city">
                    City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                  {errors.city && (
                    <span className="form-error">
                      {errors.city}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">
                    State *
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                  {errors.state && (
                    <span className="form-error">
                      {errors.state}
                    </span>
                  )}
                </div>

              </div>

              {/* Pincode */}
              <div className="form-group">
                <label htmlFor="pincode">
                  Pincode *
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                />

                {errors.pincode && (
                  <span className="form-error">
                    {errors.pincode}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large checkout-submit"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <aside className="order-summary">

            <div className="checkout-card-heading">
              <span>02</span>

              <div>
                <h2>Your items</h2>
                <p>
                  {cart.length} item
                  {cart.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="checkout-items">

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item._id}
                >

                  <div className="checkout-item-image">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=300&q=80"
                      }
                      alt={item.name}
                    />
                  </div>

                  <div className="checkout-item-info">

                    <Link
                      to={`/products/${item._id}`}
                    >
                      {item.name}
                    </Link>

                    <span>
                      {formatCurrency(
                        item.price
                      )}
                    </span>

                    <div className="checkout-item-actions">

                      <div className="mini-quantity">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                        >
                          <Minus size={13} />
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                        >
                          <Plus size={13} />
                        </button>

                      </div>

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeFromCart(item._id)
                        }
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  </div>

                </div>
              ))}

            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                {formatCurrency(cartSubtotal)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span>
                Calculated after order
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                {formatCurrency(cartSubtotal)}
              </strong>
            </div>

            <div className="secure-note">
              Your order details are securely
              processed.
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default Checkout;