import ProductCard from "./ProductCard";
import Loading from "./Loading";

const ProductGrid = ({
  products = [],
  loading = false,
  emptyMessage = "No products found.",
}) => {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <Loading key={index} variant="product" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✦</div>

        <h3>No products found</h3>

        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;