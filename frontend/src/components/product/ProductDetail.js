import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Carousel, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import ProductReview from "./ProductReview";

import { getProduct, createReview } from "../../actions/productActions";
import { addCartItem } from "../../actions/cartActions";

import {
  clearReviewSubmitted,
  clearError,
} from "../../slices/productSlice";

// ================= BACKEND URL =================
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

// ================= IMAGE URL HELPER =================
function resolveImageUrl(raw) {
  // No image
  if (!raw) {
    return "/images/placeholder.png";
  }

  // Already complete URL
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  // Remove leading slash
  let cleaned = raw.replace(/^\/+/, "");

  // If DB value contains uploads/
  cleaned = cleaned.replace(/^uploads\//i, "");

  // Backend serves:
  // /uploads -> public/uploads
  return `${BACKEND_URL}/uploads/${cleaned}`;
}

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  // ================= STATE =================
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  // ================= REDUX =================
  const {
    product = {},
    loading,
    error,
    isReviewSubmitted,
    reviewLoading,
  } = useSelector((state) => state.product || {});

  const { user } = useSelector((state) => state.auth || {});

  // ================= GET PRODUCT =================
  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  // ================= REVIEW / ERROR =================
  useEffect(() => {
    if (isReviewSubmitted) {
      setShow(false);
      setRating(1);
      setComment("");

      toast.success("Review Submitted Successfully", {
        position: "bottom-center",
      });

      dispatch(clearReviewSubmitted());
      dispatch(getProduct(id));
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
      });

      dispatch(clearError());
    }
  }, [dispatch, error, id, isReviewSubmitted]);

  // ================= QUANTITY =================
  const increaseQty = () => {
    if (product.stock === 0 || quantity >= product.stock) return;

    setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity === 1) return;

    setQuantity((q) => q - 1);
  };

  // ================= REVIEW =================
  const reviewHandler = () => {
    const reviewData = {
      rating,
      comment,
      productId: id,
    };

    dispatch(createReview(reviewData));
  };

  // ================= LOADING =================
  if (loading) {
    return <Loader />;
  }

  // ================= PRODUCT NOT FOUND =================
  if (!product?._id) {
    return (
      <div className="container text-center mt-5">
        <h4>Product not found</h4>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <Fragment>
      <MetaData title={product.name} />

      {/* ================= MAIN PRODUCT ================= */}
      <div
        className="row justify-content-center"
        style={{ marginTop: "2rem" }}
      >
        {/* ================= IMAGE ================= */}
        <div className="col-12 col-lg-5 mb-4">
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #eee",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            {product.images?.length > 0 ? (
              <Carousel pause="hover" interval={3000} wrap={true}>
                {product.images.map((image, index) => {
                  const imageUrl = resolveImageUrl(image.image);

                  return (
                    <Carousel.Item key={image._id || index}>
                      <img
                        className="d-block w-100"
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          height: "420px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          console.log(
                            "Product detail image failed:",
                            imageUrl
                          );

                          if (!e.currentTarget.dataset.fallback) {
                            e.currentTarget.dataset.fallback = "true";
                            e.currentTarget.src =
                              "/images/placeholder.png";
                          }
                        }}
                      />
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            ) : (
              <div
                style={{
                  height: "420px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f8f9fa",
                }}
              >
                <i
                  className="fa fa-image"
                  style={{
                    fontSize: "60px",
                    color: "#ddd",
                  }}
                />
              </div>
            )}

            {/* ================= STOCK BADGE ================= */}
            <div
              style={{
                padding: "12px 16px",
                background: "#f8f9fa",
                borderTop: "1px solid #eee",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: inStock ? "#e0f5f0" : "#fdecea",
                  color: inStock ? "#0d7377" : "#e7643c",
                  borderRadius: "20px",
                  padding: "5px 14px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <i
                  className={`fa ${
                    inStock
                      ? "fa-check-circle"
                      : "fa-times-circle"
                  }`}
                />

                {inStock
                  ? `In Stock (${product.stock} left)`
                  : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT INFO ================= */}
        <div
          className="col-12 col-lg-6"
          style={{ paddingLeft: "2rem" }}
        >
          {/* SKU */}
          <p
            style={{
              color: "#aaa",
              fontSize: "12px",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            <i
              className="fa fa-barcode"
              style={{ marginRight: "5px" }}
            />

            SKU: {product._id}
          </p>

          {/* Product Name */}
          <h2
            style={{
              fontWeight: 800,
              color: "#1a1a1a",
              fontSize: "26px",
              marginBottom: "0.8rem",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h2>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <div
              className="rating-outer"
              style={{ fontSize: "18px" }}
            >
              <div
                className="rating-inner"
                style={{
                  width: `${(Number(product.ratings || 0) / 5) * 100}%`,
                }}
              />
            </div>

            <span
              style={{
                color: "#888",
                fontSize: "13px",
              }}
            >
              ({product.numOfReviews}{" "}
              {product.numOfReviews === 1
                ? "Review"
                : "Reviews"}
              )
            </span>
          </div>

          <hr style={{ borderColor: "#f0f0f0" }} />

          {/* Price */}
          <div style={{ marginBottom: "1.2rem" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, #0f4c75, #0d7377)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LKR {product.price?.toLocaleString()}
            </span>
          </div>

          {/* Seller */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#f0f7ff",
              borderRadius: "8px",
              padding: "7px 14px",
              marginBottom: "1.2rem",
              border: "1px solid #d0e4f7",
            }}
          >
            <i
              className="fa fa-store"
              style={{
                color: "#1b6ca8",
                fontSize: "13px",
              }}
            />

            <span
              style={{
                fontSize: "13px",
                color: "#555",
              }}
            >
              Sold by{" "}
              <strong style={{ color: "#1b6ca8" }}>
                {product.seller}
              </strong>
            </span>
          </div>

          <hr style={{ borderColor: "#f0f0f0" }} />

          {/* Description */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h6
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i
                className="fa fa-align-left"
                style={{ color: "#1b6ca8" }}
              />

              Description
            </h6>

            <p
              style={{
                color: "#555",
                fontSize: "14px",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {product.description}
            </p>
          </div>

          <hr style={{ borderColor: "#f0f0f0" }} />

          {/* ================= QUANTITY + CART ================= */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            {/* Quantity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f8f9fa",
                borderRadius: "10px",
                border: "1.5px solid #e0e0e0",
                padding: "6px 10px",
              }}
            >
              {/* Minus */}
              <button
                onClick={decreaseQty}
                disabled={quantity === 1}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1.5px solid #1b6ca8",
                  background: "#fff",
                  color: "#1b6ca8",
                  fontWeight: 700,
                  fontSize: "18px",
                  cursor:
                    quantity === 1
                      ? "not-allowed"
                      : "pointer",
                  opacity: quantity === 1 ? 0.4 : 1,
                  lineHeight: 1,
                }}
              >
                −
              </button>

              {/* Quantity */}
              <span
                style={{
                  minWidth: "32px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#222",
                }}
              >
                {quantity}
              </span>

              {/* Plus */}
              <button
                onClick={increaseQty}
                disabled={quantity >= product.stock}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "none",
                  background:
                    quantity >= product.stock
                      ? "#ccc"
                      : "linear-gradient(135deg, #1b6ca8, #0d7377)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "18px",
                  cursor:
                    quantity >= product.stock
                      ? "not-allowed"
                      : "pointer",
                  lineHeight: 1,
                }}
              >
                +
              </button>
            </div>

            {/* Add To Cart */}
            <button
              disabled={!inStock}
              onClick={() => {
                dispatch(addCartItem(id, quantity));

                toast.success("Cart Item Added!", {
                  position: "bottom-center",
                });
              }}
              style={{
                flex: 1,
                background: inStock
                  ? "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)"
                  : "#ccc",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: inStock
                  ? "pointer"
                  : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <i className="fa fa-shopping-cart" />

              {inStock
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>

          {/* ================= REVIEW BUTTON ================= */}
          {user ? (
            <button
              onClick={() => setShow(true)}
              style={{
                width: "100%",
                background: "#fff",
                color: "#1b6ca8",
                border: "1.5px solid #1b6ca8",
                padding: "11px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <i className="fa fa-star" />

              Submit Your Review
            </button>
          ) : (
            <div className="alert alert-danger mt-4">
              Login to Post Review
            </div>
          )}
        </div>
      </div>

      {/* ================= REVIEW MODAL ================= */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Submit Review</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Stars */}
          <ul
            className="stars"
            style={{
              padding: 0,
              listStyle: "none",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <li
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "28px",
                  color:
                    star <= rating
                      ? "orange"
                      : "#ccc",
                }}
              >
                <i className="fa fa-star"></i>
              </li>
            ))}
          </ul>

          {/* Comment */}
          <textarea
            className="form-control mt-3"
            rows="4"
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write your review here..."
          />

          {/* Submit Review */}
          <button
            disabled={reviewLoading}
            onClick={reviewHandler}
            className="btn btn-primary my-3 float-right px-4"
          >
            {reviewLoading
              ? "Submitting..."
              : "Submit"}
          </button>
        </Modal.Body>
      </Modal>

      {/* ================= REVIEWS ================= */}
      {product.reviews &&
      product.reviews.length > 0 ? (
        <ProductReview
          reviews={product.reviews}
        />
      ) : (
        <div className="text-center mt-5 mb-5">
          <h5>No Reviews Yet</h5>
        </div>
      )}
    </Fragment>
  );
}

