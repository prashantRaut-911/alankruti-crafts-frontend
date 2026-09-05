import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react";

const Home = () => {
  const categories = [
    {
      name: "Handmade",
      description: "Crafted by hand with care",
      image:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85",
      link: "/products?category=handmade",
    },
    {
      name: "Home Decor",
      description: "Beautiful details for your space",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
      link: "/products?category=decor",
    },
    {
      name: "Gifts",
      description: "Thoughtful gifts with character",
      image:
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1000&q=85",
      link: "/products?category=gifts",
    },
  ];

  const features = [
    {
      icon: <Heart size={21} />,
      title: "Made With Care",
      description:
        "Every piece is selected with attention to detail.",
    },
    {
      icon: <ShieldCheck size={21} />,
      title: "Quality First",
      description:
        "We focus on quality, craftsmanship and lasting value.",
    },
    {
      icon: <Truck size={21} />,
      title: "Easy Delivery",
      description:
        "Simple ordering and convenient delivery across India.",
    },
  ];

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="container hero-grid">

          <div className="hero-content">

            <div className="eyebrow">
              <Sparkles size={15} />
              Thoughtfully crafted
            </div>

            <h1>
              Objects with
              <span> a soul.</span>
            </h1>

            <p className="hero-description">
              Discover beautiful handcrafted pieces,
              meaningful gifts and timeless decor made
              to bring character into everyday spaces.
            </p>

            <div className="hero-actions">

              <Link
                to="/products"
                className="btn btn-primary"
              >
                Explore Collection
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/support"
                className="btn btn-secondary"
              >
                Need Help?
              </Link>

            </div>

            <div className="hero-note">
              <span className="hero-note-dot" />
              Small details. Beautiful moments.
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-visual">

            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=90"
                alt="Handcrafted decorative products"
              />
            </div>

            <div className="hero-floating-card">
              <span>CURATED</span>
              <strong>Handcrafted</strong>
              <small>For meaningful spaces</small>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">
        <div className="container features-grid">

          {features.map((feature) => (
            <div
              className="feature-item"
              key={feature.title}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="categories-section section">
        <div className="container">

          <div className="section-heading">

            <div>
              <span className="section-kicker">
                Explore
              </span>

              <h2>
                Made for every corner
              </h2>
            </div>

            <Link
              to="/products"
              className="text-link"
            >
              View all
              <ArrowUpRight size={17} />
            </Link>

          </div>

          <div className="category-grid">

            {categories.map((category) => (
              <Link
                to={category.link}
                className="category-card"
                key={category.name}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />

                <div className="category-overlay">
                  <div>
                    <span>{category.description}</span>
                    <h3>{category.name}</h3>
                  </div>

                  <div className="category-arrow">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="story-section section">
        <div className="container story-grid">

          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=85"
              alt="Handcrafted artisan products"
              loading="lazy"
            />
          </div>

          <div className="story-content">

            <span className="section-kicker">
              The Alankruti way
            </span>

            <h2>
              Beautiful things don't
              need to be ordinary.
            </h2>

            <p>
              Alankruti Crafts celebrates the beauty
              of handmade products and thoughtful
              design.
            </p>

            <p>
              From everyday decor to memorable gifts,
              our collection is built around pieces
              that feel personal, warm and timeless.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Discover the collection
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      {/* ================= OFFER / COMBO ================= */}
      <section className="offers-section section">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="section-kicker">
                Curated for you
              </span>

              <h2>
                Popular combinations
              </h2>
            </div>

            <Link
              to="/products"
              className="text-link"
            >
              Shop everything
              <ArrowUpRight size={17} />
            </Link>

          </div>

          <div className="offers-grid">

            <div className="offer-card offer-large">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=85"
                alt="Home decor collection"
                loading="lazy"
              />

              <div className="offer-content">
                <span>HOME EDIT</span>
                <h3>
                  Small details,
                  <br />
                  big atmosphere.
                </h3>

                <Link
                  to="/products?category=decor"
                  className="offer-link"
                >
                  Explore decor
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="offer-card">
              <img
                src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1000&q=85"
                alt="Gift collection"
                loading="lazy"
              />

              <div className="offer-content">
                <span>GIFT EDIT</span>
                <h3>
                  Made to
                  <br />
                  be remembered.
                </h3>

                <Link
                  to="/products?category=gifts"
                  className="offer-link"
                >
                  Find a gift
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta-section">
        <div className="container">

          <div className="home-cta">

            <div>
              <span className="section-kicker">
                Have something in mind?
              </span>

              <h2>
                Let's find the right piece for you.
              </h2>
            </div>

            <Link
              to="/support"
              className="btn btn-light"
            >
              Talk to us
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;