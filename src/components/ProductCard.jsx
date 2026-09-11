import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { formatCurrency } from "../utils/formatCurrency";

const ProductCard = ({ product }) => {
  if (!product) {
    return null;
  }

  const image =
    product.image ||
    product.images?.[0] ||
    "";

  return (
    <article className="product-card">
      {/* Product Image */}
      <Link
        to={`/products/${product._id}`}
        className="product-image-wrapper"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            <span>No image available</span>
          </div>
        )}

        {product.featured && (
          <span className="product-badge">
            Featured
          </span>
        )}

        {product.stock === 0 && (
          <span className="product-badge sold-out">
            Sold Out
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className="product-card-content">
        <div className="product-category">
          {product.category || "Handcrafted"}
        </div>

        <div className="product-card-title-row">
          <div>
            <Link
              to={`/products/${product._id}`}
              className="product-name"
            >
              {product.name}
            </Link>

            {product.shortDescription && (
              <p className="product-short-description">
                {product.shortDescription}
              </p>
            )}
          </div>

          <Link
            to={`/products/${product._id}`}
            className="product-arrow"
            aria-label={`View ${product.name}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>

        <div className="product-price">
          {formatCurrency(product.price)}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;