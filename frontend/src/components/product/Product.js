import { Link } from "react-router-dom";

// Backend is running on port 8000
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

function resolveImageUrl(raw) {
  // No image
  if (!raw) {
    return "/images/placeholder.png";
  }

  // Already a complete URL
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  // Remove leading slash
  let cleaned = raw.replace(/^\/+/, "");

  // If DB value already contains "uploads/"
  cleaned = cleaned.replace(/^uploads\//i, "");

  // Backend serves:
  // /uploads -> public/uploads
  return `${BACKEND_URL}/uploads/${cleaned}`;
}

export default function Product({ product, col }) {
  const inStock = (product.stock ?? 0) > 0;

  const imageUrl = resolveImageUrl(
    product.images?.[0]?.image
  );

  const rating = Number(product.ratings ?? 0);


  return (
    <div className={`col-sm-6 col-lg-${col} mb-4`}>
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #eee",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow =
            "0 8px 24px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 2px 12px rgba(0,0,0,0.06)";
        }}
      >
        {/* ================= IMAGE ================= */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: "180px",
            background: "#f8f9fa",
          }}
        >
          <img
            loading="lazy"
            decoding="async"
            src={imageUrl}
            alt={product.name || "Product image"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s",
            }}
            onError={(e) => {
              console.log("Image failed:", imageUrl);

              if (!e.currentTarget.dataset.fallback) {
                e.currentTarget.dataset.fallback = "true";
                e.currentTarget.src =
                  "/images/placeholder.png";
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          {/* Stock badge */}
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: inStock
                ? "rgba(13,115,119,0.9)"
                : "rgba(231,76,60,0.9)",
              color: "#fff",
              borderRadius: "20px",
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* ================= BODY ================= */}
        <div
          style={{
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "8px",
          }}
        >
          {/* Product Name */}
          <h6
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: 1.3,
            }}
          >
            <Link
              to={`/product/${product._id}`}
              style={{
                color: "#1a1a1a",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1b6ca8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#1a1a1a";
              }}
            >
              {product.name}
            </Link>
          </h6>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              className="rating-outer"
              style={{ fontSize: "13px" }}
            >
              <div
                className="rating-inner"
                style={{
                  width: `${(rating / 5) * 100}%`,
                }}
              />
            </div>

            <span
              style={{
                fontSize: "11px",
                color: "#aaa",
              }}
            >
              ({product.numOfReviews ?? 0})
            </span>
          </div>

          {/* Price */}
          <div style={{ marginTop: "auto" }}>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, #0f4c75, #0d7377)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LKR {(product.price ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Seller */}
          {product.seller && (
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#aaa",
              }}
            >
              <i
                className="fa fa-store"
                style={{
                  marginRight: "4px",
                  color: "#1b6ca8",
                }}
              />

              {product.seller}
            </p>
          )}

          {/* View Details */}
          <Link
            to={`/product/${product._id}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              background:
                "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
              color: "#fff",
              textDecoration: "none",
              padding: "9px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              transition: "opacity 0.2s",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <i className="fa fa-eye" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}