import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getReviews } from "../../actions/productActions";
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function ReviewList() {
  const { reviews = [], loading = true, error, isReviewDeleted } = useSelector(
    (state) => state.product || {}
  );

  const [productId,   setProductId]   = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const renderStars = (rating) => (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div className="rating-outer" style={{ fontSize: "13px" }}>
        <div className="rating-inner" style={{ width: `${(rating / 5) * 100}%` }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color: "#b07800" }}>
        {rating}
      </span>
    </div>
  );

  const setReviews = () => {
    const data = {
      columns: [
        { label: "Review ID", field: "id",      sort: "asc" },
        { label: "User",      field: "user",    sort: "asc" },
        { label: "Rating",    field: "rating",  sort: "asc" },
        { label: "Comment",   field: "comment", sort: "asc" },
        { label: "Actions",   field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    reviews.forEach((review) => {
      data.rows.push({
        id: (
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#1b6ca8", fontWeight: 600 }}>
            #{review._id?.slice(-8).toUpperCase()}
          </span>
        ),
        user: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg, #0f4c75, #0d7377)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "11px", fontWeight: 700, flexShrink: 0,
            }}>
              {review.user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "13px" }}>
              {review.user?.name}
            </span>
          </div>
        ),
        rating: renderStars(review.rating),
        comment: (
          <span style={{
            color: "#555", fontSize: "13px", lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            maxWidth: "260px",
          }}>
            {review.comment}
          </span>
        ),
        actions: (
          <button
            onClick={(e) => deleteHandler(e, review._id)}
            title="Delete Review"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px", borderRadius: "8px",
              background: "#fdecea", border: "1px solid #fcd0ce",
              color: "#e74c3c", cursor: "pointer",
            }}
          >
            <i className="fa fa-trash" style={{ fontSize: "13px" }} />
          </button>
        ),
      });
    });

    return data;
  };

  // ✅ Fixed — reviewId (id) first, productId second
  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteReview(id, productId));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (productId.trim()) dispatch(getReviews(productId));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }
    if (isReviewDeleted) {
      toast("Review deleted successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearReviewDeleted()),
      });
      dispatch(getReviews(productId));
      return;
    }
  }, [dispatch, error, isReviewDeleted, productId]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "220px" : "64px",
        flexShrink: 0, transition: "width 0.25s ease", overflow: "hidden",
      }}>
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: "#f4f6fb", minWidth: 0, display: "flex", flexDirection: "column" }}>

        {/* Top Bar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #eee",
          padding: "0 1.5rem", height: "56px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              width: "36px", height: "36px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#555", fontSize: "16px",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f4f8"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <i className={`fa fa-${sidebarOpen ? "indent" : "dedent"}`} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#888" }}>
            <i className="fa fa-home" style={{ color: "#1b6ca8" }} />
            <span>/</span>
            <span style={{ color: "#1b6ca8", fontWeight: 600 }}>Review List</span>
          </div>

          {reviews.length > 0 && (
            <span style={{
              background: "#e8f0fb", color: "#1b6ca8",
              borderRadius: "6px", padding: "4px 12px",
              fontSize: "12px", fontWeight: 700,
            }}>
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem 1.8rem", flex: 1 }}>

          {/* Page Header */}
          <div style={{
            background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
            borderRadius: "14px", padding: "1.2rem 1.8rem",
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 16px rgba(15,76,117,0.2)",
          }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="fa fa-star" style={{ color: "#5ce1e6", fontSize: "20px" }} />
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Review List</h4>
              <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
                Search by product ID to manage reviews
              </p>
            </div>
          </div>

          {/* Search Card */}
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            padding: "1.4rem 1.8rem",
            marginBottom: "1.5rem",
          }}>
            <h6 style={{
              fontSize: "11px", fontWeight: 700, color: "#888",
              textTransform: "uppercase", letterSpacing: "0.8px",
              marginBottom: "1rem",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <i className="fa fa-search" style={{ color: "#1b6ca8" }} />
              Search Reviews by Product ID
            </h6>

            <form onSubmit={submitHandler} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Paste product ID here..."
                  style={{
                    width: "100%", borderRadius: "8px",
                    border: "1.5px solid #e0e0e0", padding: "10px 14px",
                    fontSize: "14px", outline: "none",
                    transition: "border-color 0.2s", boxSizing: "border-box",
                    fontFamily: "monospace",
                  }}
                  onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                  onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                />
                {/* ✅ Helper text */}
                <p style={{ fontSize: "11px", color: "#aaa", margin: "6px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                  <i className="fa fa-info-circle" style={{ color: "#1b6ca8" }} />
                  Go to <strong style={{ color: "#1b6ca8", margin: "0 3px" }}>Product List</strong>, copy the product ID and paste it here.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || !productId.trim()}
                style={{
                  background: loading || !productId.trim()
                    ? "#ccc"
                    : "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
                  color: "#fff", border: "none",
                  padding: "10px 24px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 700,
                  cursor: loading || !productId.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "8px",
                  whiteSpace: "nowrap", marginTop: "1px",
                }}
              >
                <i className={`fa ${loading ? "fa-spinner fa-spin" : "fa-search"}`} />
                {loading ? "Searching..." : "Get Reviews"}
              </button>
            </form>
          </div>

          {/* Reviews Table */}
          {reviews.length > 0 ? (
            <div style={{
              background: "#fff", borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                padding: "0.9rem 1.5rem",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <i className="fa fa-star" style={{ color: "#5ce1e6", fontSize: "14px" }} />
                <h6 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                  {reviews.length} Review{reviews.length !== 1 ? "s" : ""} Found
                </h6>
              </div>
              <MDBDataTable
                data={setReviews()}
                bordered
                striped
                hover
                className="px-3"
              />
            </div>
          ) : (
            !loading && productId && (
              <div style={{
                background: "#fff", borderRadius: "14px",
                border: "1px solid #eee", padding: "3rem",
                textAlign: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}>
                <i className="fa fa-star-o" style={{ fontSize: "48px", color: "#ddd", display: "block", marginBottom: "1rem" }} />
                <h5 style={{ color: "#888", fontWeight: 600 }}>No reviews found</h5>
                <p style={{ color: "#aaa", fontSize: "13px" }}>
                  No reviews found for this product ID.
                </p>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}