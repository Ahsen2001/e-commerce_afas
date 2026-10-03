import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { orderCompleted } from "../../slices/cartSlice";

export default function OrderSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(orderCompleted());
  }, [dispatch]);

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ textAlign: "center", maxWidth: "480px", width: "100%" }}>

        {/* Success Circle */}
        <div style={{
          width: "100px", height: "100px", borderRadius: "50%",
          background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.8rem",
          boxShadow: "0 8px 24px rgba(13,115,119,0.3)",
        }}>
          <i className="fa fa-check" style={{ color: "#fff", fontSize: "44px" }} />
        </div>

        {/* Title */}
        <h2 style={{ fontWeight: 800, color: "#222", fontSize: "28px", marginBottom: "0.5rem" }}>
          Thank you for your order!
        </h2>
        <p style={{ color: "#888", fontSize: "15px", marginBottom: "2.5rem", lineHeight: 1.6 }}>
          Your order has been placed successfully.<br />
          We'll send you a confirmation shortly.
        </p>

        {/* Status Pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "2.5rem" }}>
          {[
            { icon: "fa-archive", label: "Order Placed", color: "#1b6ca8", bg: "#e8f0fb" },
            { icon: "fa-cog",     label: "Processing",   color: "#fa9c23", bg: "#fff4e0" },
            { icon: "fa-truck",   label: "Shipping Soon",color: "#0d7377", bg: "#e0f5f5" },
          ].map(({ icon, label, color, bg }) => (
            <div key={label} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              background: bg, borderRadius: "12px",
              padding: "14px 16px", flex: 1,
            }}>
              <i className={`fa ${icon}`} style={{ fontSize: "22px", color }} />
              <span style={{ fontSize: "11px", color, fontWeight: 700, letterSpacing: "0.3px" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <Link to="/orders" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
          color: "#fff", textDecoration: "none",
          padding: "14px 24px", borderRadius: "10px",
          fontSize: "15px", fontWeight: 700, marginBottom: "10px",
          transition: "opacity 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <i className="fa fa-archive" />
          View My Orders
        </Link>

        <Link to="/" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          background: "#fff", color: "#1b6ca8", textDecoration: "none",
          padding: "14px 24px", borderRadius: "10px",
          fontSize: "15px", fontWeight: 700,
          border: "1.5px solid #1b6ca8",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1b6ca8"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1b6ca8"; }}
        >
          <i className="fa fa-arrow-left" />
          Continue Shopping
        </Link>

      </div>
    </div>
  );
}