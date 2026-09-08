import {
  useEffect,
  useState,
} from "react";

import {
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getAdminOrders,
  updateOrderStatus,
} from "../../services/orderService";

import { formatCurrency } from "../../utils/formatCurrency";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminOrders({
          page: 1,
          limit: 100,
        });

      setOrders(
        response.data?.orders ||
          response.orders ||
          []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);

      await updateOrderStatus(
        orderId,
        status
      );

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      toast.success(
        "Order status updated."
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  return (
    <div className="admin-page">
      <div className="container">

        <section className="admin-page-header">

          <div>
            <span className="section-kicker">
              Store operations
            </span>

            <h1>
              Orders
            </h1>

            <p>
              Review orders and update their
              fulfilment status.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadOrders}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </section>

        {error && (
          <div className="error-message">

            <h3>
              Unable to load orders
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadOrders}
            >
              Try Again
            </button>

          </div>
        )}

        {loading && (
          <div className="admin-loading">
            Loading orders...
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="empty-state">

              <div className="empty-state-icon">
                <ShoppingBag size={25} />
              </div>

              <h3>
                No orders yet
              </h3>

              <p>
                Customer orders will appear here
                after they place an order.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="admin-orders-list">

              {orders.map((order) => (
                <article
                  className="admin-order-card"
                  key={order._id}
                >

                  <div className="admin-order-header">

                    <div>
                      <span className="order-label">
                        Order ID
                      </span>

                      <strong>
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

                  <div className="admin-order-details">

                    <div>
                      <span>
                        Customer
                      </span>

                      <strong>
                        {order.customer?.name ||
                          "Customer"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Mobile
                      </span>

                      <strong>
                        {order.customer?.phone ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Date
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>
                    </div>

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

                  <div className="admin-order-items">

                    <strong>
                      Items
                    </strong>

                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={
                            item._id ||
                            index
                          }
                          className="admin-order-item"
                        >
                          <span>
                            {item.product?.name ||
                              "Product"}
                          </span>

                          <span>
                            × {item.quantity}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                  <div className="admin-order-footer">

                    <div>
                      <span>
                        Delivery
                      </span>

                      <p>
                        {order.customer?.address ||
                          "—"}
                        {order.customer?.city
                          ? `, ${order.customer.city}`
                          : ""}
                        {order.customer?.state
                          ? `, ${order.customer.state}`
                          : ""}
                        {order.customer?.pincode
                          ? ` - ${order.customer.pincode}`
                          : ""}
                      </p>
                    </div>

                    <div className="admin-status-control">

                      <label
                        htmlFor={`status-${order._id}`}
                      >
                        Update status
                      </label>

                      <select
                        id={`status-${order._id}`}
                        value={
                          order.status ||
                          "pending"
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            event.target.value
                          )
                        }
                      >
                        {ORDER_STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status
                                .charAt(0)
                                .toUpperCase() +
                                status.slice(1)}
                            </option>
                          )
                        )}
                      </select>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

      </div>
    </div>
  );
};

export default OrderManagement;