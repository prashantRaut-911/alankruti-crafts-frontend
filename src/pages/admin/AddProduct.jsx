import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createProduct } from "../../services/productService";
import api from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  images: [],
  stock: "",
  isAvailable: true,
  featured: false,
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialForm);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] =
    useState([]);

  const [uploadingImages, setUploadingImages] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageChange = async (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingSlots =
      5 - imageFiles.length;

    if (selectedFiles.length > remainingSlots) {
      toast.error(
        `You can upload only ${remainingSlots} more image${
          remainingSlots === 1 ? "" : "s"
        }. Maximum 5 images.`
      );

      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Only JPG, PNG, WEBP, or GIF images are allowed."
        );

        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          `${file.name} is larger than 5 MB.`
        );

        event.target.value = "";
        return;
      }
    }

    const newPreviews = selectedFiles.map(
      (file) => ({
        file,
        preview: URL.createObjectURL(file),
      })
    );

    setImageFiles((previous) => [
      ...previous,
      ...selectedFiles,
    ]);

    setImagePreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    event.target.value = "";

    try {
      setUploadingImages(true);

      const uploadData = new FormData();

      selectedFiles.forEach((file) => {
        uploadData.append("images", file);
      });

      const response = await api.post(
        "/upload/images",
        uploadData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const uploadedImages =
        response.data?.images || [];

      if (
        uploadedImages.length !==
        selectedFiles.length
      ) {
        throw new Error(
          "Some images were not uploaded successfully."
        );
      }

      setFormData((previous) => {
        const allImages = [
          ...previous.images,
          ...uploadedImages.map(
            (item) => item.url
          ),
        ];

        return {
          ...previous,
          image: allImages[0] || "",
          images: allImages,
        };
      });

      toast.success(
        `${uploadedImages.length} image${
          uploadedImages.length > 1
            ? "s"
            : ""
        } uploaded successfully.`
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to upload images.";

      toast.error(message);

      setImageFiles((previous) =>
        previous.slice(
          0,
          previous.length -
            selectedFiles.length
        )
      );

      setImagePreviews((previous) =>
        previous.slice(
          0,
          previous.length -
            selectedFiles.length
        )
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setImageFiles((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setImagePreviews((previous) => {
      const item = previous[index];

      if (item?.preview) {
        URL.revokeObjectURL(
          item.preview
        );
      }

      return previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });

    setFormData((previous) => {
      const updatedImages =
        previous.images.filter(
          (_, imageIndex) =>
            imageIndex !== index
        );

      return {
        ...previous,
        image:
          updatedImages[0] || "",
        images: updatedImages,
      };
    });
  };

  const setMainImage = (index) => {
    if (index === 0) {
      return;
    }

    setImageFiles((previous) => {
      const updated = [...previous];
      const [selected] =
        updated.splice(index, 1);

      updated.unshift(selected);

      return updated;
    });

    setImagePreviews((previous) => {
      const updated = [...previous];
      const [selected] =
        updated.splice(index, 1);

      updated.unshift(selected);

      return updated;
    });

    setFormData((previous) => {
      const updatedImages = [
        ...previous.images,
      ];

      const [selected] =
        updatedImages.splice(index, 1);

      updatedImages.unshift(selected);

      return {
        ...previous,
        image:
          updatedImages[0] || "",
        images: updatedImages,
      };
    });

    toast.success(
      "Main image changed."
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(
        "Product name is required."
      );
      return false;
    }

    if (!formData.description.trim()) {
      toast.error(
        "Product description is required."
      );
      return false;
    }

    if (!formData.category.trim()) {
      toast.error(
        "Product category is required."
      );
      return false;
    }

    if (
      formData.price === "" ||
      Number.isNaN(
        Number(formData.price)
      ) ||
      Number(formData.price) < 0
    ) {
      toast.error(
        "Please enter a valid product price."
      );
      return false;
    }

    if (
      formData.stock === "" ||
      Number.isNaN(
        Number(formData.stock)
      ) ||
      Number(formData.stock) < 0
    ) {
      toast.error(
        "Please enter a valid stock quantity."
      );
      return false;
    }

    if (uploadingImages) {
      toast.error(
        "Please wait until image uploads finish."
      );
      return false;
    }

    if (formData.images.length === 0) {
      toast.error(
        "Please upload at least one product image."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const productData = {
        name: formData.name.trim(),
        description:
          formData.description.trim(),
        price: Number(formData.price),
        category:
          formData.category.trim(),
        image: formData.image,
        images: formData.images,
        stock: Number(formData.stock),
        isAvailable:
          formData.isAvailable,
        featured: formData.featured,
      };

      await createProduct(productData);

      toast.success(
        "Product created successfully."
      );

      navigate("/admin/products");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to create product.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy =
    submitting || uploadingImages;

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">
            Admin
          </p>

          <h1>Add Product</h1>

          <p>
            Add a new product to your
            Alankruti Crafts catalogue.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="btn btn-secondary"
        >
          ← Back to Products
        </Link>
      </div>

      <section className="admin-form-card">
        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <div className="form-section-heading">
              <h2>
                Product Information
              </h2>

              <p>
                Enter the basic details of
                your handmade product.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Handmade Warli Art"
                  maxLength={150}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Describe the product, craftsmanship, material, size, etc."
                  rows={6}
                  maxLength={2000}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Price (₹)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1499"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">
                  Stock Quantity
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={
                    formData.category
                  }
                  onChange={handleChange}
                  placeholder="e.g. Wall Art"
                  maxLength={100}
                  required
                />
              </div>

              {/* PRODUCT IMAGES */}

              <div className="form-group form-group-full">
                <label htmlFor="product-images">
                  Product Images
                </label>

                <input
                  id="product-images"
                  name="product-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={
                    handleImageChange
                  }
                  disabled={isBusy}
                />

                <small className="form-help">
                  Upload up to 5 images.
                  JPG, PNG, WEBP or GIF.
                  Maximum 5 MB per image.
                </small>

                <small className="form-help">
                  The first image is the
                  main product image.
                </small>

                {uploadingImages && (
                  <div className="form-help">
                    Uploading images to
                    Cloudinary...
                  </div>
                )}
              </div>

              {/* IMAGE GALLERY */}

              {imagePreviews.length > 0 && (
                <div className="form-group form-group-full">
                  <label>
                    Product Image Gallery
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "16px",
                      marginTop: "8px",
                    }}
                  >
                    {imagePreviews.map(
                      (item, index) => (
                        <div
                          key={`${item.file.name}-${index}`}
                          style={{
                            position:
                              "relative",
                            border:
                              index === 0
                                ? "2px solid currentColor"
                                : "1px solid #ddd",
                            borderRadius:
                              "12px",
                            overflow:
                              "hidden",
                            padding:
                              "8px",
                          }}
                        >
                          <img
                            src={
                              item.preview
                            }
                            alt={`Product ${
                              index + 1
                            }`}
                            style={{
                              display:
                                "block",
                              width: "100%",
                              height:
                                "160px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "8px",
                            }}
                          />

                          {index === 0 && (
                            <div
                              style={{
                                marginTop:
                                  "8px",
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "600",
                              }}
                            >
                              Main Image
                            </div>
                          )}

                          {index !== 0 && (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() =>
                                setMainImage(
                                  index
                                )
                              }
                              disabled={
                                isBusy
                              }
                              style={{
                                marginTop:
                                  "8px",
                                width: "100%",
                              }}
                            >
                              Make Main
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            disabled={
                              isBusy
                            }
                            style={{
                              marginTop:
                                "8px",
                              width: "100%",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="form-group form-group-full">
                <label htmlFor="isAvailable">
                  Product Availability
                </label>

                <label className="checkbox-field">
                  <input
                    id="isAvailable"
                    name="isAvailable"
                    type="checkbox"
                    checked={
                      formData.isAvailable
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Make this product
                    available to customers
                  </span>
                </label>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="featured">
                  Featured Product
                </label>

                <label className="checkbox-field">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={
                      formData.featured
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Show this product as
                    a featured product
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link
              to="/admin/products"
              className="btn btn-secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isBusy}
            >
              {uploadingImages
                ? "Uploading Images..."
                : submitting
                  ? "Creating..."
                  : "Create Product"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddProduct;