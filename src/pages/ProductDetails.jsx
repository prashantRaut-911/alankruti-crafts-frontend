import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import { useProduct } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import { openWhatsApp } from "../utils/whatsapp";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { product, loading, error, refetch } =
    useProduct(id);

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] =
    useState(0);

  if (loading) {
    return (
      <div className="container page-loading">
        <Loading />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container page-section">
        <ErrorMessage
          message={
            error || "Product could not be found."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85",
        ];

  const maxQuantity = Math.max(
    1,
    Number(product.stock || 1)
  );

  const increaseQuantity = () => {
    setQuantity((previous) =>
      Math.min(previous + 1, maxQuantity)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);

    toast.success(
      `${product.name} added to your cart.`
    );
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const handleWhatsApp = () => {
    openWhatsApp(
      `Hello Alankruti Crafts,\n\nI am interested in "${product.name}".\n\nPlease share more details.`
    );
  };

  return (
    <div className="product-details-page">

      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/products">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>

        <div className="product-details-grid">

          {/* ================= IMAGES ================= */}
          <div className="product-gallery">

            <div className="product-main-image">
              <img
                src={images[selectedImage]}
                alt={product.name}
              />

              {product.isFeatured && (
                <span className="product-badge">
                  Featured
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="product-thumbnails">

                {images.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={
                      selectedImage === index
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedImage(index)
                    }
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </button>
                ))}

              </div>
            )}
          </div>

          {/* ================= INFORMATION ================= */}
          <div className="product-details-content">

            <span className="product-detail-category">
              {product.category || "Handcrafted"}
            </span>

            <h1>{product.name}</h1>

            <div className="product-detail-price">
              {formatCurrency(product.price)}
            </div>

            {product.shortDescription && (
              <p className="product-detail-short">
                {product.shortDescription}
              </p>
            )}

            <div className="product-stock">

              <span
                className={
                  product.stock > 0
                    ? "stock-available"
                    : "stock-unavailable"
                }
              >
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Currently unavailable"}
              </span>

            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="quantity-row">

                <span>Quantity</span>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= maxQuantity
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>

                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-actions">

              <button
                type="button"
                className="btn btn-primary btn-large"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-large"
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>

            <button
              type="button"
              className="whatsapp-product-button"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={18} />
              Ask about this product on WhatsApp
            </button>

            {/* Description */}
            <div className="product-description">

              <h3>
                About this product
              </h3>

              <p>
                {product.description}
              </p>

            </div>

            {/* Product details */}
            <div className="product-meta">

              <div>
                <span>Category</span>
                <strong>
                  {product.category ||
                    "Handcrafted"}
                </strong>
              </div>

              <div>
                <span>Availability</span>
                <strong>
                  {product.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </strong>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;