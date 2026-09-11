import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
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

  const {
    product,
    loading,
    error,
    refetch,
  } = useProduct(id);

  const { addToCart } = useCart();

  const [quantity, setQuantity] =
    useState(1);

  const [selectedImage, setSelectedImage] =
    useState(0);

  /*
   * Build a clean image list.
   *
   * Supports:
   * 1. New products using image + images[]
   * 2. Older products using only image
   * 3. Products with images[] but no image
   */
  const images = product
    ? [
        ...(product.image
          ? [product.image]
          : []),
        ...(Array.isArray(
          product.images
        )
          ? product.images.filter(
              (image) =>
                image &&
                image !== product.image
            )
          : []),
      ]
    : [];

  /*
   * Make sure selected image stays
   * valid if product data changes.
   */
  useEffect(() => {
    if (
      images.length === 0
    ) {
      setSelectedImage(0);
      return;
    }

    if (
      selectedImage >=
      images.length
    ) {
      setSelectedImage(0);
    }
  }, [
    images.length,
    selectedImage,
  ]);

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
            error ||
            "Product could not be found."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasImage =
    images.length > 0;

  /*
   * A product is purchasable only when:
   * - it is marked available
   * - stock is greater than zero
   */
  const isAvailable =
    product.isAvailable === true &&
    Number(product.stock) > 0;

  const maxQuantity = Math.max(
    1,
    Number(product.stock || 1)
  );

  const increaseQuantity = () => {
    setQuantity((previous) =>
      Math.min(
        previous + 1,
        maxQuantity
      )
    );
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(
        previous - 1,
        1
      )
    );
  };

  const showPreviousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setSelectedImage(
      (previous) =>
        previous === 0
          ? images.length - 1
          : previous - 1
    );
  };

  const showNextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setSelectedImage(
      (previous) =>
        previous ===
        images.length - 1
          ? 0
          : previous + 1
    );
  };

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.error(
        "This product is currently unavailable."
      );
      return;
    }

    addToCart(
      product,
      quantity
    );

    toast.success(
      `${product.name} added to your cart.`
    );
  };

  const handleBuyNow = () => {
    if (!isAvailable) {
      toast.error(
        "This product is currently unavailable."
      );
      return;
    }

    addToCart(
      product,
      quantity
    );

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

              {hasImage ? (
                <>
                  <img
                    src={
                      images[
                        selectedImage
                      ]
                    }
                    alt={`${product.name} - ${
                      selectedImage + 1
                    }`}
                  />

                  {/* Navigation arrows */}

                  {images.length >
                    1 && (
                    <>
                      <button
                        type="button"
                        className="product-gallery-arrow product-gallery-arrow-left"
                        onClick={
                          showPreviousImage
                        }
                        aria-label="Previous product image"
                      >
                        <ChevronLeft
                          size={22}
                        />
                      </button>

                      <button
                        type="button"
                        className="product-gallery-arrow product-gallery-arrow-right"
                        onClick={
                          showNextImage
                        }
                        aria-label="Next product image"
                      >
                        <ChevronRight
                          size={22}
                        />
                      </button>

                      {/* Image counter */}

                      <div className="product-image-counter">
                        {selectedImage +
                          1}{" "}
                        /{" "}
                        {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="product-image-placeholder">
                  <span>
                    No image available
                  </span>
                </div>
              )}

              {product.featured && (
                <span className="product-badge">
                  Featured
                </span>
              )}
            </div>

            {/* Thumbnails */}

            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={
                        selectedImage ===
                        index
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      aria-label={`View product image ${
                        index + 1
                      }`}
                      aria-current={
                        selectedImage ===
                        index
                          ? "true"
                          : undefined
                      }
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )}
              </div>
            )}

            {/* Mobile image indicators */}

            {images.length > 1 && (
              <div className="product-gallery-dots">
                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={`${image}-dot-${index}`}
                      type="button"
                      className={
                        selectedImage ===
                        index
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* ================= INFORMATION ================= */}

          <div className="product-details-content">

            <span className="product-detail-category">
              {product.category ||
                "Handcrafted"}
            </span>

            <h1>
              {product.name}
            </h1>

            <div className="product-detail-price">
              {formatCurrency(
                product.price
              )}
            </div>

            {product.shortDescription && (
              <p className="product-detail-short">
                {
                  product.shortDescription
                }
              </p>
            )}

            {/* Availability */}

            <div className="product-stock">
              <span
                className={
                  isAvailable
                    ? "stock-available"
                    : "stock-unavailable"
                }
              >
                {isAvailable
                  ? `${product.stock} available`
                  : "Currently unavailable"}
              </span>
            </div>

            {/* Quantity */}

            {isAvailable && (
              <div className="quantity-row">
                <span>
                  Quantity
                </span>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus
                      size={16}
                    />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >=
                      maxQuantity
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus
                      size={16}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}

            <div className="product-actions">

              <button
                type="button"
                className="btn btn-primary btn-large"
                disabled={
                  !isAvailable
                }
                onClick={
                  handleAddToCart
                }
              >
                <ShoppingBag
                  size={19}
                />

                {isAvailable
                  ? "Add to Cart"
                  : "Currently Unavailable"}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-large"
                disabled={
                  !isAvailable
                }
                onClick={
                  handleBuyNow
                }
              >
                Buy Now
              </button>
            </div>

            <button
              type="button"
              className="whatsapp-product-button"
              onClick={
                handleWhatsApp
              }
            >
              <MessageCircle
                size={18}
              />
              Ask about this product
              on WhatsApp
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
                <span>
                  Category
                </span>

                <strong>
                  {product.category ||
                    "Handcrafted"}
                </strong>
              </div>

              <div>
                <span>
                  Availability
                </span>

                <strong>
                  {isAvailable
                    ? "In Stock"
                    : "Currently Unavailable"}
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