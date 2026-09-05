import { useEffect, useState } from "react";

const defaultForm = {
  name: "",
  description: "",
  shortDescription: "",
  price: "",
  category: "",
  stock: "",
  images: "",
  isFeatured: false,
  isAvailable: true,
};

const ProductForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Save Product",
}) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) {
      setForm(defaultForm);
      return;
    }

    setForm({
      name: initialData.name || "",
      description: initialData.description || "",
      shortDescription:
        initialData.shortDescription || "",
      price: initialData.price ?? "",
      category: initialData.category || "",
      stock: initialData.stock ?? "",
      images:
        initialData.images?.join("\n") || "",
      isFeatured:
        Boolean(initialData.isFeatured),
      isAvailable:
        initialData.isAvailable !== false,
    });
  }, [initialData]);

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

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Product name is required.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Product description is required.";
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      newErrors.price =
        "Enter a valid price.";
    }

    if (!form.category.trim()) {
      newErrors.category =
        "Category is required.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      newErrors.stock =
        "Enter valid stock quantity.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      shortDescription:
        form.shortDescription.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      images: form.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean),
      isFeatured: form.isFeatured,
      isAvailable: form.isAvailable,
    };

    await onSubmit(payload);
  };

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >

      {/* Product Name */}
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
          placeholder="Example: Handcrafted Warli Wall Art"
        />

        {errors.name && (
          <span className="form-error">
            {errors.name}
          </span>
        )}
      </div>

      {/* Short Description */}
      <div className="form-group">
        <label htmlFor="shortDescription">
          Short Description
        </label>

        <input
          id="shortDescription"
          name="shortDescription"
          type="text"
          value={form.shortDescription}
          onChange={handleChange}
          placeholder="A short product summary"
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">
          Description *
        </label>

        <textarea
          id="description"
          name="description"
          rows="6"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the product, materials, craftsmanship, size, etc."
        />

        {errors.description && (
          <span className="form-error">
            {errors.description}
          </span>
        )}
      </div>

      {/* Two Column Row */}
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
            placeholder="999"
          />

          {errors.price && (
            <span className="form-error">
              {errors.price}
            </span>
          )}
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
            placeholder="10"
          />

          {errors.stock && (
            <span className="form-error">
              {errors.stock}
            </span>
          )}
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
          placeholder="Handmade, Decor, Gifts..."
        />

        {errors.category && (
          <span className="form-error">
            {errors.category}
          </span>
        )}
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
            "Paste one image URL per line"
          }
        />

        <small className="form-help">
          For now, add one image URL per line.
          We will connect Cloudinary image upload
          in the next backend phase.
        </small>
      </div>

      {/* Toggles */}
      <div className="form-checkbox-group">

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />

          <span>
            Show as featured product
          </span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />

          <span>
            Product is available
          </span>
        </label>

      </div>

      {/* Submit */}
      <div className="form-actions">

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : submitText}
        </button>

      </div>

    </form>
  );
};

export default ProductForm;