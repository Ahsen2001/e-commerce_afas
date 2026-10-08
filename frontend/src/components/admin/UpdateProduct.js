import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/productSlice";
import { toast } from "react-toastify";

// Base URL of your backend (where express.static serves /uploads from).
// Set REACT_APP_BACKEND_URL in your frontend .env, e.g.:
// REACT_APP_BACKEND_URL=http://localhost:4000
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

function resolveImageUrl(raw) {
  if (!raw) return "/images/placeholder.png";
  if (/^https?:\/\//i.test(raw)) return raw;
  const cleaned = raw.replace(/^\/?(uploads\/)?/i, "");
  return `${BACKEND_URL}/uploads/${cleaned}`;
}

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");

  // NEW IMAGES
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // OLD IMAGES FROM DB
  const [oldImages, setOldImages] = useState([]);

  const [imagesCleared, setImagesCleared] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { id: productId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isProductUpdated, error, product } = useSelector(
    (state) => state.product
  );

  const categories = [
    "Handicrafts & Souvenirs",
    "Batik & Clothing",
    "Tea, Spices & Herbal",
    "Ayurvedic Wellness",
    "Cultural Art & Masks",
    "Jewellery & Gems",
    "Wood & Handmade Items",
    "Traditional Food",
    "Eco-friendly Products",
    "Village Products",
    "Tour Packages",
    "Experiences & Activities",
  ];

  // ADD NEW IMAGES
  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // REMOVE NEW IMAGE
  const removeImage = (index) => {
    setImagesPreview((old) => old.filter((_, i) => i !== index));
    setImages((old) => old.filter((_, i) => i !== index));
  };

  // REMOVE OLD IMAGE
  const removeOldImage = (index) => {
    setOldImages((old) => old.filter((_, i) => i !== index));
  };

  // CLEAR ALL IMAGES
  const clearImagesHandler = () => {
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);
    setImagesCleared(true);
  };

  // SUBMIT
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("seller", seller);
    formData.append("category", category);

    formData.append("imagesCleared", imagesCleared);

    // REMAINING OLD IMAGES
    formData.append("oldImages", JSON.stringify(oldImages));

    // NEW IMAGES
    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(updateProduct(productId, formData));
  };

  // SUCCESS / ERROR
  useEffect(() => {
    if (isProductUpdated) {
      toast("Product updated successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductUpdated()),
      });

      navigate("/admin/products");
      return;
    }

    if (error) {
      toast(error, {
        type: "error",
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });

      return;
    }

    dispatch(getProduct(productId));
  }, [dispatch, productId, isProductUpdated, error, navigate]);

  // LOAD PRODUCT
  useEffect(() => {
    if (product?._id) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setSeller(product.seller);
      setCategory(product.category);

      // OLD DB IMAGES
      setOldImages(product.images || []);
    }
  }, [product]);

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "6px",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "8px",
    border: "1.5px solid #e0e0e0",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    background: "#fff",
    fontFamily: "inherit",
  };

  const totalImageCount = oldImages.length + imagesPreview.length;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "var(--admin-sidebar-width)" : "var(--admin-sidebar-collapsed-width)",
          flexShrink: 0,
          transition: "width 0.25s ease",
          overflow: "hidden",
        }}
      >
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          background: "#f4f6fb",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #eee",
            padding: "0 1.5rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              fontSize: "16px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4f8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <i className={`fa fa-${sidebarOpen ? "indent" : "dedent"}`} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#888",
            }}
          >
            <i className="fa fa-home" style={{ color: "#1b6ca8" }} />
            <span>/</span>
            <span style={{ color: "#555" }}>Products</span>
            <span>/</span>
            <span style={{ color: "#1b6ca8", fontWeight: 600 }}>
              Update
            </span>
          </div>

          <div style={{ width: "36px" }} />
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem 1.8rem", flex: 1 }}>
          {/* Page Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
              borderRadius: "14px",
              padding: "1.2rem 1.8rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 16px rgba(15,76,117,0.2)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fa fa-pencil"
                style={{ color: "#5ce1e6", fontSize: "20px" }}
              />
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                Update Product
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Edit product details and manage images
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <form onSubmit={submitHandler} encType="multipart/form-data">
              <div
                style={{
                  padding: "1.8rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.2rem",
                }}
              >
                {/* Name */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-tag" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>

                {/* Price */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-money" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    value={price}
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>

                {/* Stock */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-cubes" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    required
                    onChange={(e) => setStock(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>

                {/* Seller */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-user" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Seller Name
                  </label>
                  <input
                    type="text"
                    value={seller}
                    required
                    onChange={(e) => setSeller(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-th-large" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Category
                  </label>
                  <select
                    value={category}
                    required
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description — full width */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>
                    <i className="fa fa-align-left" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Description
                  </label>
                  <textarea
                    rows={5}
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>

                {/* Images — full width */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>
                    <i className="fa fa-image" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Product Images
                  </label>

                  {/* Drop zone */}
                  <label
                    htmlFor="update_product_images"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      border: "2px dashed #d0e4f7",
                      borderRadius: "10px",
                      padding: "2rem",
                      cursor: "pointer",
                      background: "#f8fbff",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1b6ca8")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d0e4f7")}
                  >
                    <i
                      className="fa fa-cloud-upload"
                      style={{ fontSize: "32px", color: "#1b6ca8", opacity: 0.6 }}
                    />
                    <span style={{ color: "#888", fontSize: "13px", fontWeight: 600 }}>
                      Click to upload or drag & drop images
                    </span>
                    <span style={{ color: "#bbb", fontSize: "11px" }}>
                      PNG, JPG, WEBP — multiple allowed
                    </span>
                    <input
                      type="file"
                      id="update_product_images"
                      multiple
                      accept="image/*"
                      onChange={onImagesChange}
                      style={{ display: "none" }}
                    />
                  </label>

                  {/* Image previews */}
                  {totalImageCount > 0 && (
                    <div style={{ marginTop: "14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#555",
                          }}
                        >
                          <i
                            className="fa fa-images"
                            style={{ marginRight: "6px", color: "#1b6ca8" }}
                          />
                          {totalImageCount} {totalImageCount === 1 ? "Image" : "Images"}
                        </span>

                        <button
                          type="button"
                          onClick={clearImagesHandler}
                          style={{
                            background: "#fdecea",
                            color: "#e74c3c",
                            border: "1px solid #f7d3ce",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className="fa fa-trash" />
                          Clear All
                        </button>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {/* OLD IMAGES */}
                        {oldImages.map((img, index) => (
                          <div key={`old-${index}`} style={{ position: "relative" }}>
                            <img
                              src={resolveImageUrl(img.image)}
                              alt=""
                              style={{
                                width: "80px",
                                height: "70px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1.5px solid #e0e0e0",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "2px",
                                left: "2px",
                                background: "rgba(0,0,0,0.55)",
                                color: "#fff",
                                fontSize: "9px",
                                fontWeight: 700,
                                borderRadius: "4px",
                                padding: "1px 5px",
                              }}
                            >
                              SAVED
                            </span>
                            <button
                              type="button"
                              onClick={() => removeOldImage(index)}
                              style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                background: "#e74c3c",
                                border: "none",
                                color: "#fff",
                                fontSize: "10px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i className="fa fa-times" />
                            </button>
                          </div>
                        ))}

                        {/* NEW IMAGES */}
                        {imagesPreview.map((img, index) => (
                          <div key={`new-${index}`} style={{ position: "relative" }}>
                            <img
                              src={img}
                              alt=""
                              style={{
                                width: "80px",
                                height: "70px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1.5px solid #1b6ca8",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "2px",
                                left: "2px",
                                background: "rgba(27,108,168,0.85)",
                                color: "#fff",
                                fontSize: "9px",
                                fontWeight: 700,
                                borderRadius: "4px",
                                padding: "1px 5px",
                              }}
                            >
                              NEW
                            </span>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                background: "#e74c3c",
                                border: "none",
                                color: "#fff",
                                fontSize: "10px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i className="fa fa-times" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div
                style={{
                  padding: "1.2rem 1.8rem",
                  borderTop: "1px solid #f0f0f0",
                  background: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  style={{
                    background: "#fff",
                    color: "#555",
                    border: "1.5px solid #e0e0e0",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading
                      ? "#ccc"
                      : "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "10px 28px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className={`fa ${loading ? "fa-spinner fa-spin" : "fa-save"}`} />
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}