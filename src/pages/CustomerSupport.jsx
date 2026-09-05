import {
  MessageCircle,
  ShoppingBag,
  Truck,
  HelpCircle,
  ArrowRight,
  Clock3,
} from "lucide-react";

import { openWhatsApp } from "../utils/whatsapp";

const CustomerSupport = () => {
  const supportOptions = [
    {
      icon: <ShoppingBag size={22} />,
      title: "Order Help",
      description:
        "Questions about an order you've already placed?",
      message:
        "Hello Alankruti Crafts, I need help with my order.",
    },
    {
      icon: <Truck size={22} />,
      title: "Delivery",
      description:
        "Need help with delivery or shipping information?",
      message:
        "Hello Alankruti Crafts, I have a question about delivery.",
    },
    {
      icon: <HelpCircle size={22} />,
      title: "Product Questions",
      description:
        "Want more information before placing an order?",
      message:
        "Hello Alankruti Crafts, I have a question about a product.",
    },
  ];

  return (
    <div className="support-page">

      {/* ================= HEADER ================= */}
      <section className="page-header support-header">

        <div className="container">

          <span className="section-kicker">
            We're here to help
          </span>

          <h1>
            How can we help?
          </h1>

          <p>
            Have a question about a product, order
            or delivery? Send us a message and our
            team will help you.
          </p>

        </div>

      </section>

      {/* ================= MAIN ================= */}
      <section className="support-section section">

        <div className="container">

          {/* WhatsApp CTA */}
          <div className="support-hero-card">

            <div className="support-hero-icon">
              <MessageCircle size={30} />
            </div>

            <div className="support-hero-content">

              <span className="section-kicker">
                Fastest response
              </span>

              <h2>
                Chat with us on WhatsApp
              </h2>

              <p>
                Send us your question directly.
                We'll help you with products, orders,
                delivery and anything else you need.
              </p>

              <button
                type="button"
                className="btn btn-light"
                onClick={() =>
                  openWhatsApp(
                    "Hello Alankruti Crafts, I need some help."
                  )
                }
              >
                Start a conversation
                <ArrowRight size={18} />
              </button>

            </div>

            <div className="support-response-time">

              <Clock3 size={17} />

              <span>
                Response during business hours
              </span>

            </div>

          </div>

          {/* ================= OPTIONS ================= */}
          <div className="support-options">

            <div className="section-heading">

              <div>
                <span className="section-kicker">
                  Support
                </span>

                <h2>
                  What do you need help with?
                </h2>
              </div>

            </div>

            <div className="support-grid">

              {supportOptions.map((option) => (
                <div
                  className="support-card"
                  key={option.title}
                >

                  <div className="support-card-icon">
                    {option.icon}
                  </div>

                  <h3>
                    {option.title}
                  </h3>

                  <p>
                    {option.description}
                  </p>

                  <button
                    type="button"
                    className="support-card-link"
                    onClick={() =>
                      openWhatsApp(
                        option.message
                      )
                    }
                  >
                    Ask us
                    <ArrowRight size={16} />
                  </button>

                </div>
              ))}

            </div>

          </div>

          {/* ================= FAQ ================= */}
          <div className="support-faq">

            <span className="section-kicker">
              Frequently asked
            </span>

            <h2>
              A few quick answers
            </h2>

            <div className="faq-list">

              <details>
                <summary>
                  How can I place an order?
                </summary>

                <p>
                  Browse our collection, open a
                  product, select your quantity and
                  add it to your cart. Continue to
                  checkout and enter your delivery
                  details.
                </p>
              </details>

              <details>
                <summary>
                  How will I pay?
                </summary>

                <p>
                  After your order is created, we'll
                  provide payment instructions. UPI
                  payment integration will be connected
                  to the store's checkout flow.
                </p>
              </details>

              <details>
                <summary>
                  Can I ask about a product before buying?
                </summary>

                <p>
                  Absolutely. Use the WhatsApp support
                  option and mention the product you're
                  interested in.
                </p>
              </details>

              <details>
                <summary>
                  How can I track my order?
                </summary>

                <p>
                  Use the My Orders section with the
                  mobile number used during checkout.
                  Order status will be updated as your
                  order progresses.
                </p>
              </details>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default CustomerSupport;