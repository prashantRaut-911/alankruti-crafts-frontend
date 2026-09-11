import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
  getProduct,
  updateProduct,
} from "../../services/productService";

import api from "../../services/api";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [uploadingImages, setUploadingImages] =
    useState(false);

  const [error, setError] =
    useState("");

  const [imageItems, setImageItems] =
    useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProduct(id);

        const product =
          response.product;

        if (!product) {
          setError(
            "Product not found."
          );
          return;
        }

        const productImages =
          Array.isArray(product.images) &&
          product.images.length > 0
            ? product.images
            : product.image
              ? [product.image]
              : [];

        setFormData({
          name: product.name || "",
          description:
            product.description || "",
          price:
            product.price !== undefined
              ? product.price
              : "",
          category:
            product.category || "",
          image:
            product.image ||
            productImages[0] ||
            "",
          images: productImages,
          stock:
            product.stock !== undefined
              ? product.stock
              : "",
          isAvailable:
            product.isAvailable !==
            undefined
              ? product.isAvailable
              : true,
          featured:
            product.featured !==
            undefined
              ? product.featured
              : false,
        });

        setImageItems(
          productImages.map((url) => ({
            url,
            isNew: false,
          }))
        );
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    return () => {
      imageItems.forEach((item) => {
        if (
          item.isNew &&
          item.preview
        ) {
          URL.revokeObjectURL(
            item.preview
          );
        }
      });
    };
  }, [imageItems]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageChange = async (
    event
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    const remainingSlots =
      5 - imageItems.length;

    if (
      selectedFiles.length >
      remainingSlots
    ) {
      toast.error(
        `You can upload only ${remainingSlots} more image${
          remainingSlots === 1
            ? ""
            : "s"
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
      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        toast.error(
          "Only JPG, PNG, WEBP, or GIF images are allowed."
        );

        event.target.value = "";
        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        toast.error(
          `${file.name} is larger than 5 MB.`
        );

        event.target.value = "";
        return;
      }
    }

    const temporaryItems =
      selectedFiles.map((file) => ({
        file,
        preview:
          URL.createObjectURL(file),
        isNew: true,
        uploading: true,
      }));

    setImageItems((previous) => [
      ...previous,
      ...temporaryItems,
    ]);

    event.target.value = "";

    try {
      setUploadingImages(true);

      const uploadData =
        new FormData();

      selectedFiles.forEach(
        (file) => {
          uploadData.append(
            "images",
            file
          );
        }
      );

      const response =
        await api.post(
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

      const uploadedItems =
        uploadedImages.map(
          (item) => ({
            url: item.url,
            publicId:
              item.publicId || "",
            isNew: true,
            uploading: false,
          })
        );

      setImageItems((previous) => {
        const existingItems =
          previous.slice(
            0,
            previous.length -
              selectedFiles.length
          );

        return [
          ...existingItems,
          ...uploadedItems,
        ];
      });

      setFormData((previous) => {
        const allImages = [
          ...previous.images,
          ...uploadedImages.map(
            (item) => item.url
          ),
        ];

        return {
          ...previous,
          image:
            allImages[0] || "",
          images: allImages,
        };
      });

      toast.success(
        `${uploadedImages.length} image${
          uploadedImages.length >
          1
            ? "s"
            : ""
        } uploaded successfully.`
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to upload images.";

      toast.error(message);

      setImageItems((previous) =>
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
    const item =
      imageItems[index];

    if (!item) {
      return;
    }

    if (
      item.isNew &&
      item.preview
    ) {
      URL.revokeObjectURL(
        item.preview
      );
    }

    setImageItems((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

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
    if (
      index === 0 ||
      !imageItems[index]
    ) {
      return;
    }

    setImageItems((previous) => {
      const updated = [
        ...previous,
      ];

      const [
        selected,
      ] = updated.splice(
        index,
        1
      );

      updated.unshift(selected);

      return updated;
    });

    setFormData((previous) => {
      const updatedImages = [
        ...previous.images,
      ];

      const [
        selected,
      ] = updatedImages.splice(
        index,
        1
      );

      updatedImages.unshift(
        selected
      );

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

    if (
      !formData.description.trim()
    ) {
      toast.error(
        "Product description is required."
      );
      return false;
    }

    if (
      !formData.category.trim()
    ) {
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

    if (
      formData.images.length ===
      0
    ) {
      toast.error(
        "Please keep at least one product image."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const productData = {
        name:
          formData.name.trim(),
        description:
          formData.description.trim(),
        price: Number(
          formData.price
        ),
        category:
          formData.category.trim(),
        image:
          formData.image.trim(),
        images:
          formData.images,
        stock: Number(
          formData.stock
        ),
        isAvailable:
          formData.isAvailable,
        featured:
          formData.featured,
      };

      await updateProduct(
        id,
        productData
      );

      toast.success(
        "Product updated successfully."
      );

      navigate(
        "/admin/products"
      );
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Unable to update product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main className="admin-page">
        <ErrorMessage
          message={error}
        />

        <Link
          to="/admin/products"
          className="btn btn-secondary"
        >
          ← Back to Products
        </Link>
      </main>
    );
  }

  const isBusy =
    submitting ||
    uploadingImages;

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">
            Admin
          </p>

          <h1>
            Edit Product
          </h1>

          <p>
            Update your product
            information and
            catalogue settings.
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
                Update the details of
                this handmade product.
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
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
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
                  onChange={
                    handleChange
                  }
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
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
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
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
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
                  onChange={
                    handleChange
                  }
                  maxLength={100}
                  required
                />
              </div>

              {/* IMAGE UPLOAD */}

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
                  Maximum 5 images
                  total. JPG, PNG,
                  WEBP or GIF.
                  Maximum 5 MB per
                  image.
                </small>

                {uploadingImages && (
                  <small className="form-help">
                    Uploading images
                    to Cloudinary...
                  </small>
                )}
              </div>

              {/* IMAGE GALLERY */}

              {imageItems.length >
                0 && (
                <div className="form-group form-group-full">
                  <label>
                    Product Image
                    Gallery
                  </label>

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "16px",
                      marginTop:
                        "8px",
                    }}
                  >
                    {imageItems.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={`${item.url || item.preview}-${index}`}
                          style={{
                            position:
                              "relative",
                            border:
                              index ===
                              0
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
                              item.preview ||
                              item.url
                            }
                            alt={`${formData.name} ${
                              index +
                              1
                            }`}
                            style={{
                              display:
                                "block",
                              width:
                                "100%",
                              height:
                                "160px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "8px",
                            }}
                          />

                          {index ===
                            0 && (
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

                          {index !==
                            0 && (
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
                                width:
                                  "100%",
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
                              isBusy ||
                              imageItems.length ===
                                1
                            }
                            style={{
                              marginTop:
                                "8px",
                              width:
                                "100%",
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
                <label>
                  Product Availability
                </label>

                <label className="checkbox-field">
                  <input
                    name="isAvailable"
                    type="checkbox"
                    checked={
                      formData.isAvailable
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    Make this product
                    available to
                    customers
                  </span>
                </label>
              </div>

              <div className="form-group form-group-full">
                <label>
                  Featured Product
                </label>

                <label className="checkbox-field">
                  <input
                    name="featured"
                    type="checkbox"
                    checked={
                      formData.featured
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    Show this product
                    as a featured
                    product
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
                  ? "Saving..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default EditProduct;