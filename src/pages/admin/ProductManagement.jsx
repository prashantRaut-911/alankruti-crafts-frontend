import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/productService";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async (
    page = 1,
    searchValue = search,
    categoryValue = category,
    availabilityValue = availability
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
        sort: "newest",
        isAvailable: availabilityValue,
      };

      if (searchValue.trim()) {
        params.search = searchValue.trim();
      }

      if (categoryValue.trim()) {
        params.category = categoryValue.trim();
      }

      const response = await getProducts(params);

      setProducts(response.products || []);

      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          limit: 10,
        }
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Unable to load products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    loadProducts(
      1,
      search,
      category,
      availability
    );
  };

  const handleAvailabilityChange = (event) => {
    const value = event.target.value;

    setAvailability(value);

    loadProducts(
      1,
      search,
      category,
      value
    );
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product._id);

      toast.success("Product deleted successfully.");

      const nextPage =
        products.length === 1 &&
        pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;

      await loadProducts(
        nextPage,
        search,
        category,
        availability
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      await updateProduct(product._id, {
        isAvailable: !product.isAvailable,
      });

      toast.success(
        product.isAvailable
          ? "Product marked unavailable."
          : "Product marked available."
      );

      await loadProducts(
        pagination.currentPage,
        search,
        category,
        availability
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Unable to update product availability."
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Admin</p>

          <h1>Product Management</h1>

          <p>
            Manage your Alankruti Crafts product
            catalogue.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="btn btn-primary"
        >
          + Add Product
        </Link>
      </div>

      <section className="admin-toolbar">
        <form
          className="admin-filter-form"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <input
            type="text"
            placeholder="Category..."
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          />

          <select
            value={availability}
            onChange={handleAvailabilityChange}
          >
            <option value="all">
              All Products
            </option>

            <option value="true">
              Available
            </option>

            <option value="false">
              Unavailable
            </option>
          </select>

          <button
            type="submit"
            className="btn btn-secondary"
          >
            Search
          </button>
        </form>
      </section>

      {error ? (
        <ErrorMessage message={error} />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>

          <p>
            Add your first product to start building
            your catalogue.
          </p>

          <Link
            to="/admin/products/new"
            className="btn btn-primary"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <>
          <section className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="admin-product-cell">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <div className="admin-product-placeholder">
                            No Image
                          </div>
                        )}

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          <small>
                            ID: {product._id}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td>
                      {formatCurrency(
                        product.price
                      )}
                    </td>

                    <td>{product.stock}</td>

                    <td>
                      <button
                        type="button"
                        className={`status-badge ${
                          product.isAvailable
                            ? "status-available"
                            : "status-unavailable"
                        }`}
                        onClick={() =>
                          handleToggleAvailability(
                            product
                          )
                        }
                      >
                        {product.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </button>
                    </td>

                    <td>
                      {product.featured
                        ? "Yes"
                        : "No"}
                    </td>

                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="btn btn-small btn-secondary"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="btn btn-small btn-danger"
                          onClick={() =>
                            handleDelete(product)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="admin-pagination">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={
                pagination.currentPage <= 1
              }
              onClick={() =>
                loadProducts(
                  pagination.currentPage - 1,
                  search,
                  category,
                  availability
                )
              }
            >
              Previous
            </button>

            <span>
              Page {pagination.currentPage} of{" "}
              {Math.max(
                pagination.totalPages,
                1
              )}
            </span>

            <button
              type="button"
              className="btn btn-secondary"
              disabled={
                pagination.currentPage >=
                pagination.totalPages
              }
              onClick={() =>
                loadProducts(
                  pagination.currentPage + 1,
                  search,
                  category,
                  availability
                )
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default ProductManagement;