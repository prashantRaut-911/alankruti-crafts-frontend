import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

import { formatCurrency } from "../../utils/formatCurrency";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        limit: 100,
      });

      setProducts(
        response.data?.products ||
          response.products ||
          []
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product._id);

      await deleteProduct(product._id);

      setProducts((previous) =>
        previous.filter(
          (item) =>
            item._id !== product._id
        )
      );

      toast.success(
        "Product deleted successfully."
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts =
    products.filter((product) =>
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="admin-page">
      <div className="container">

        {/* Header */}
        <section className="admin-page-header">

          <div>
            <span className="section-kicker">
              Catalogue
            </span>

            <h1>
              Products
            </h1>

            <p>
              Add and manage products available
              in your Alankruti Crafts store.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="btn btn-primary"
          >
            <Plus size={17} />
            Add Product
          </Link>

        </section>

        {/* Toolbar */}
        <div className="admin-toolbar">

          <div className="admin-search">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
            />
          </div>

          <span className="admin-count">
            {filteredProducts.length} products
          </span>

        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            <strong>
              Unable to load products
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadProducts}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            Loading products...
          </div>
        )}

        {/* Products */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="admin-product-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    (product) => (
                      <tr key={product._id}>

                        <td>
                          <div className="admin-product-cell">

                            <div className="admin-product-image">
                              <img
                                src={
                                  product.images?.[0] ||
                                  "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=200&q=80"
                                }
                                alt={product.name}
                              />
                            </div>

                            <div>
                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                ID: {product._id}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          {product.category ||
                            "—"}
                        </td>

                        <td>
                          {formatCurrency(
                            product.price || 0
                          )}
                        </td>

                        <td>
                          {product.stock ?? 0}
                        </td>

                        <td>
                          <span
                            className={
                              product.isAvailable === false
                                ? "status cancelled"
                                : "status delivered"
                            }
                          >
                            {product.isAvailable === false
                              ? "Unavailable"
                              : "Available"}
                          </span>
                        </td>

                        <td>
                          <div className="admin-table-actions">

                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className="icon-button"
                              title="Edit product"
                            >
                              <Pencil size={16} />
                            </Link>

                            <button
                              type="button"
                              className="icon-button danger"
                              title="Delete product"
                              disabled={
                                deletingId ===
                                product._id
                              }
                              onClick={() =>
                                handleDelete(product)
                              }
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="empty-state">

              <div className="empty-state-icon">
                <Package size={25} />
              </div>

              <h3>
                {search
                  ? "No products found"
                  : "No products yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "Add your first product to start building your catalogue."}
              </p>

              {!search && (
                <Link
                  to="/admin/products/new"
                  className="btn btn-primary"
                >
                  <Plus size={17} />
                  Add Product
                </Link>
              )}

            </div>
          )}

      </div>
    </div>
  );
};

export default ProductManagement;