import { Link, useLocation, useParams } from "react-router-dom";
import {
  CheckCircle2,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { formatCurrency } from "../utils/formatCurrency";
import { openWhatsApp } from "../utils/whatsapp";

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  const customerName =
    order?.customer?.name || "Customer";

  const total =
    order?.total ??
    order?.totalAmount ??
    0;

  const handleWhatsApp = () => {
    const message = `Hello Alankruti Crafts,

I have placed an order.

Order ID: ${id}
Name: ${customerName}
${total ? `Total: ${formatCurrency(total)}` : ""}

Please confirm my order.`;

    openWhatsApp(message);
  };

  return (
    <div className="order-success-page">

      <div className="container">

        <div className="success-card">

          {/* Success Icon */}
          <div className="success-icon">
            <CheckCircle2 size={42} />
          </div>

          <span className="section-kicker">
            Order received
          </span>

          <h1>
            Thank you, {customerName}.
          </h1>

          <p className="success-description">
            Your order has been successfully placed.
            We’ll get in touch with you shortly with
            the next steps.
          </p>

          {/* Order ID */}
          <div className="order-id-box">

            <span>
              Order ID
            </span>

            <strong>
              {id}
            </strong>

          </div>

          {/* Order Total */}
          {total > 0 && (
            <div className="success-total">

              <span>
                Order Total
              </span>

              <strong>
                {formatCurrency(total)}
              </strong>

            </div>
          )}

          {/* Payment Notice */}
          <div className="payment-notice">

            <ShoppingBag size={20} />

            <div>
              <strong>
                Payment
              </strong>

              <p>
                Your order has been received.
                We’ll share payment instructions
                with you through WhatsApp.
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="success-actions">

            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={18} />
              Confirm on WhatsApp
            </button>

            <Link
              to="/products"
              className="btn btn-secondary btn-large"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>

          </div>

          {/* Order History */}
          <Link
            to="/orders"
            className="success-orders-link"
          >
            View my orders
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;