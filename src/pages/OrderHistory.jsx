import { useState } from "react";
import {
  Search,
  Package,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

import { getMyOrders } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";

const OrderHistory = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    const cleanPhone = phone.trim();

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const response =
        await getMyOrders(cleanPhone);

      setOrders(
        response.data?.orders || []
      );
    } catch (err) {
      setOrders([]);

      const message =
        err.response?.data?.message ||
        "Unable to retrieve your orders.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "status delivered";

      case "cancelled":
        return "status cancelled";

      case "shipped":
        return "status shipped";

      case "confirmed":
        return "status confirmed";

      default:
        return "status pending";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="orders-page">

      {/* ================= HEADER ================= */}
      <section className="page-header">
        <div className="container">

          <span className="section-kicker">
            Your purchases
          </span>

          <h1>
            My Orders
          </h1>

          <p>
            Enter the mobile number used during
            checkout to view your orders.
          </p>

        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="orders-section section">

        <div className="container">

          <div className="orders-search-card">

            <div className="orders-search-icon">
              <Package size={24} />
            </div>

            <div className="orders-search-content">

              <h2>
                Find your orders
              </h2>

              <p>
                Use the mobile number associated
                with your purchase.
              </p>

              <form
                className="orders-search-form"
                onSubmit={handleSearch}
              >

                <div className="orders-input-wrapper">

                  <Search size={18} />

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    value={phone}
                    onChange={(event) => {
                      setPhone(
                        event.target.value
                      );
                      setError("");
                    }}
                    placeholder="10-digit mobile number"
                    aria-label="Mobile number"
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Searching..."
                    : "Find Orders"}
                </button>

              </form>

              {error && (
                <p className="form-error">
                  {error}
                </p>
              )}

            </div>

          </div>

          {/* ================= RESULTS ================= */}

          {searched && !loading && (
            <div className="orders-results">

              <div className="orders-results-header">

                <div>
                  <span className="section-kicker">
                    Order history
                  </span>

                  <h2>
                    {orders.length}{" "}
                    {orders.length === 1
                      ? "order"
                      : "orders"}
                  </h2>
                </div>

              </div>

              {orders.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-state-icon">
                    <Package size={25} />
                  </div>

                  <h3>
                    No orders found
                  </h3>

                  <p>
                    We couldn't find any orders
                    associated with this mobile
                    number.
                  </p>

                </div>
              ) : (
                <div className="orders-list">

                  {orders.map((order) => (
                    <article
                      className="order-card"
                      key={order._id}
                    >

                      {/* Order Top */}
                      <div className="order-card-top">

                        <div>

                          <span className="order-label">
                            Order ID
                          </span>

                          <strong className="order-number">
                            {order._id}
                          </strong>

                        </div>

                        <span
                          className={getStatusClass(
                            order.status
                          )}
                        >
                          {order.status ||
                            "pending"}
                        </span>

                      </div>

                      {/* Order Information */}
                      <div className="order-card-info">

                        <div className="order-info-item">

                          <CalendarDays
                            size={17}
                          />

                          <div>
                            <span>
                              Placed
                            </span>

                            <strong>
                              {formatDate(
                                order.createdAt
                              )}
                            </strong>
                          </div>

                        </div>

                        <div className="order-info-item">

                          <Package
                            size={17}
                          />

                          <div>
                            <span>
                              Items
                            </span>

                            <strong>
                              {order.items
                                ?.length || 0}
                            </strong>
                          </div>

                        </div>

                        <div className="order-info-item">

                          <div>
                            <span>
                              Total
                            </span>

                            <strong>
                              {formatCurrency(
                                order.total || 0
                              )}
                            </strong>
                          </div>

                        </div>

                      </div>

                      {/* Items Preview */}
                      {order.items?.length > 0 && (
                        <div className="order-items-preview">

                          {order.items
                            .slice(0, 3)
                            .map((item, index) => (
                              <div
                                className="order-preview-item"
                                key={
                                  item._id ||
                                  index
                                }
                              >
                                <span>
                                  {item.product
                                    ?.name ||
                                    "Product"}
                                </span>

                                <span>
                                  ×{" "}
                                  {item.quantity}
                                </span>
                              </div>
                            ))}

                          {order.items.length > 3 && (
                            <span className="order-more-items">
                              +{" "}
                              {order.items.length -
                                3}{" "}
                              more
                            </span>
                          )}

                        </div>
                      )}

                    </article>
                  ))}

                </div>
              )}

            </div>
          )}

        </div>

      </section>

    </div>
  );
};

export default OrderHistory;