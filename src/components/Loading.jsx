const Loading = ({ variant = "default" }) => {
  if (variant === "product") {
    return (
      <div className="product-card loading-card">
        <div className="skeleton skeleton-image" />

        <div className="loading-card-content">
          <div className="skeleton skeleton-small" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-price" />
        </div>
      </div>
    );
  }

  return (
    <div className="loading-wrapper">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;