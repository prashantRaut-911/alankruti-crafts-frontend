import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Save,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getProduct,
  updateProduct,
} from "../../services/productService";

const EditProduct = () => {
  const {
    id,
  } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: "",
    isAvailable: true,
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProduct(id);

        const product =
          response.data?.product ||
          response.product;

        if (!product) {
          throw new Error(
            "Product not found."
          );
        }

        setForm({
          name: product.name || "",
          description:
            product.description || "",
          price:
            product.price ?? "",
          category:
            product.category || "",
          stock:
            product.stock ?? "",
          images:
            product.images?.join("\n") || "",
          isAvailable:
            product.isAvailable !== false,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

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

    if (!form.category.trim()) {
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
      setSaving(true);

      const imageList = form.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean);

      const productData = {
        name: form.name.trim(),
        description:
          form.description.trim(),
        price: Number(form.price),
        category:
          form.category.trim(),
        stock: Number(form.stock),
        images: imageList,
        isAvailable:
          form.isAvailable,
      };

      await updateProduct(
        id,
        productData
      );

      toast.success(
        "Product updated successfully."
      );

      navigate("/admin/products");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="admin-loading">
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="container">

          <div className="error-message">

            <h3>
              Unable to load product
            </h3>

            <p>
              {error}
            </p>

            <Link
              to="/admin/products"
              className="btn btn-secondary"
            >
              Back to Products
            </Link>

          </div>

        </div>
      </div>
    );
  }

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
              Edit Product
            </h1>

            <p>
              Update product information,
              pricing and availability.
            </p>

          </div>

        </section>

        <div className="admin-form-card">

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

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
                disabled={saving}
              />
            </div>

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
                disabled={saving}
              />
            </div>

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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>

            </div>

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
                disabled={saving}
              />
            </div>

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
                placeholder="One image URL per line"
                disabled={saving}
              />

            </div>

            <label className="admin-checkbox">

              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                disabled={saving}
              />

              <span>
                Product is available for sale
              </span>

            </label>

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
                disabled={saving}
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default EditProduct;