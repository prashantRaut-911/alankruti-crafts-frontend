import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Save,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  createProduct,
} from "../../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: "",
    isAvailable: true,
  });

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "Please enter the product name."
      );
      return;
    }

    if (
      !form.price ||
      Number(form.price) < 0
    ) {
      toast.error(
        "Please enter a valid price."
      );
      return;
    }

    if (
      !form.category.trim()
    ) {
      toast.error(
        "Please enter a category."
      );
      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      toast.error(
        "Please enter valid stock."
      );
      return;
    }

    try {
      setLoading(true);

      const imageList = form.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean);

      const productData = {
        name: form.name.trim(),
        description:
          form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
        images: imageList,
        isAvailable: form.isAvailable,
      };

      await createProduct(productData);

      toast.success(
        "Product created successfully."
      );

      navigate("/admin/products");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">

        <section className="admin-page-header">

          <div>
            <Link
              to="/admin/products"
              className="breadcrumb"
            >
              <ArrowLeft size={16} />
              Products
            </Link>

            <span className="section-kicker">
              Catalogue
            </span>

            <h1>
              Add Product
            </h1>

            <p>
              Create a new product for your
              storefront.
            </p>
          </div>

        </section>

        <div className="admin-form-card">

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                Product Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Handmade Warli Painting"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product..."
                disabled={loading}
              />
            </div>

            {/* Price + Stock */}
            <div className="form-grid-2">

              <div className="form-group">
                <label htmlFor="price">
                  Price (₹) *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">
                  Stock *
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={loading}
                />
              </div>

            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">
                Category *
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="Example: Home Decor"
                disabled={loading}
              />
            </div>

            {/* Images */}
            <div className="form-group">

              <label htmlFor="images">
                Product Images
              </label>

              <textarea
                id="images"
                name="images"
                rows="5"
                value={form.images}
                onChange={handleChange}
                placeholder={
                  "Paste image URLs, one per line"
                }
                disabled={loading}
              />

              <small>
                Cloudinary image upload will be
                connected in the backend phase.
              </small>

            </div>

            {/* Availability */}
            <label className="admin-checkbox">

              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                disabled={loading}
              />

              <span>
                Product is available for sale
              </span>

            </label>

            {/* Actions */}
            <div className="admin-form-actions">

              <Link
                to="/admin/products"
                className="btn btn-secondary"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={17} />

                {loading
                  ? "Creating..."
                  : "Create Product"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default AddProduct;