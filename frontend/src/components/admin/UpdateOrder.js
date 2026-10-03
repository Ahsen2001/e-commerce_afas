import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder } from "../../actions/orderActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";

export default function UpdateOrder() {
  const { loading, isOrderUpdated, error, orderDetail } = useSelector(
    (state) => state.order || {}
  );
  const {
    user = {},
    orderItems = [],
    shippingInfo = {},
    totalPrice = 0,
    paymentInfo = {},
  } = orderDetail;

  const isPaid = paymentInfo.status === "succeeded";
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { id: orderId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateOrder(orderId, { orderStatus }));
  };

  useEffect(() => {
    if (isOrderUpdated) {
      toast("Order Updated Successfully!", {
        type: "success",
        position:"bottom-center",
        onOpen: () => dispatch(clearOrderUpdated()),
      });
      return;
    }
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }
    dispatch(orderDetailAction(orderId));
  }, [isOrderUpdated, error, dispatch]);

  useEffect(() => {
    if (orderDetail._id) {
      setOrderStatus(orderDetail.orderStatus);
    }
  }, [orderDetail]);

  const statusStyle = (status) => {
    if (status === "Delivered")  return { bg: "#e0f5f0", color: "#0d7377" };
    if (status === "Shipped")    return { bg: "#e8f0fb", color: "#1b6ca8" };
    if (status === "Processing") return { bg: "#fff4e0", color: "#b07800" };
    return                              { bg: "#fdecea", color: "#e74c3c" };
  };

  const statusIcon = (status) => {
    if (status === "Delivered")  return "check-circle";
    if (status === "Shipped")    return "truck";
    if (status === "Processing") return "cog";
    return "times-circle";
  };

  const s = statusStyle(orderStatus);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "220px" : "64px",
        flexShrink: 0,
        transition: "width 0.25s ease",
        overflow: "hidden",
      }}>
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        background: "#f4f6fb",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Top Bar */}
        <div style={{
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
        }}>
          {/* Hamburger */}
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

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#888" }}>
            <i className="fa fa-home" style={{ color: "#1b6ca8" }} />
            <span>/</span>
            <Link
              to="/admin/orders"
              style={{ color: "#888", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1b6ca8"}
              onMouseLeave={e => e.currentTarget.style.color = "#888"}
            >
              Order List
            </Link>
            <span>/</span>
            <span style={{ color: "#1b6ca8", fontWeight: 600 }}>Update Order</span>
          </div>

          {/* Status pill */}
          <span style={{
            background: s.bg, color: s.color,
            borderRadius: "6px", padding: "4px 14px",
            fontSize: "12px", fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: "6px",
          }}>
            <i className={`fa fa-${statusIcon(orderStatus)}`} style={{ fontSize: "11px" }} />
            {orderStatus}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem 1.8rem", flex: 1 }}>

          {/* Page Header */}
          <div style={{
            background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
            borderRadius: "14px",
            padding: "1.2rem 1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 16px rgba(15,76,117,0.2)",
          }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="fa fa-pencil-square-o" style={{ color: "#5ce1e6", fontSize: "20px" }} />
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Update Order</h4>
              <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px", fontFamily: "monospace" }}>
                #{orderDetail._id?.slice(-8).toUpperCase() || "—"}
              </p>
            </div>

            {/* Back button */}
            <Link
              to="/admin/orders"
              style={{
                marginLeft: "auto",
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(255,255,255,0.15)",
                color: "#fff", textDecoration: "none",
                borderRadius: "8px", padding: "6px 14px",
                fontSize: "13px", fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              <i className="fa fa-arrow-left" style={{ fontSize: "11px" }} />
              Back to Orders
            </Link>
          </div>

          {/* Body Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.2rem", alignItems: "start" }}>

            {/* Left — Order Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

              {/* Shipping Info Card */}
              <div style={{
                background: "#fff", borderRadius: "14px",
                border: "1px solid #eee",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "1rem 1.4rem",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <i className="fa fa-map-marker" style={{ color: "#1b6ca8", fontSize: "15px" }} />
                  <h6 style={{ margin: 0, fontWeight: 700, color: "#1a2236" }}>Shipping Information</h6>
                </div>
                <div style={{ padding: "1.2rem 1.4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                  {[
                    { icon: "user",   label: "Customer",  value: user.name },
                    { icon: "phone",  label: "Phone",     value: shippingInfo.phoneNo },
                    { icon: "envelope", label: "Email",   value: user.email },
                    { icon: "credit-card", label: "Payment", value: isPaid
                        ? "Paid"
                        : "Not Paid",
                      valueStyle: { color: isPaid ? "#0d7377" : "#e74c3c", fontWeight: 700 }
                    },
                  ].map(({ icon, label, value, valueStyle }) => (
                    <div key={label} style={{
                      background: "#f8fafd", borderRadius: "10px",
                      padding: "0.8rem 1rem",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <i className={`fa fa-${icon}`} style={{ color: "#1b6ca8", fontSize: "11px" }} />
                        <span style={{ fontSize: "11px", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {label}
                        </span>
                      </div>
                      <span style={{ fontSize: "14px", color: "#1a2236", fontWeight: 500, ...valueStyle }}>
                        {value || "—"}
                      </span>
                    </div>
                  ))}

                  {/* Address — full width */}
                  <div style={{
                    background: "#f8fafd", borderRadius: "10px",
                    padding: "0.8rem 1rem", gridColumn: "1 / -1",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <i className="fa fa-home" style={{ color: "#1b6ca8", fontSize: "11px" }} />
                      <span style={{ fontSize: "11px", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Address
                      </span>
                    </div>
                    <span style={{ fontSize: "14px", color: "#1a2236", fontWeight: 500 }}>
                      {[shippingInfo.address, shippingInfo.city, shippingInfo.postalCode, shippingInfo.state, shippingInfo.country]
                        .filter(Boolean).join(", ") || "—"}
                    </span>
                  </div>

                  {/* Total — full width */}
                  <div style={{
                    background: "linear-gradient(135deg, #e8f0fb, #e0f5f0)",
                    borderRadius: "10px", padding: "0.8rem 1rem",
                    gridColumn: "1 / -1",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <i className="fa fa-money" style={{ color: "#0d7377", fontSize: "13px" }} />
                      <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>Order Total</span>
                    </div>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#0d7377" }}>
                      LKR {totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Card */}
              <div style={{
                background: "#fff", borderRadius: "14px",
                border: "1px solid #eee",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "1rem 1.4rem",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa fa-shopping-bag" style={{ color: "#1b6ca8", fontSize: "15px" }} />
                    <h6 style={{ margin: 0, fontWeight: 700, color: "#1a2236" }}>Order Items</h6>
                  </div>
                  <span style={{
                    background: "#f0f7ff", color: "#1b6ca8",
                    borderRadius: "6px", padding: "3px 10px",
                    fontSize: "12px", fontWeight: 700,
                  }}>
                    {orderItems.length} item{orderItems.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div style={{ padding: "0.6rem 0" }}>
                  {orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex", alignItems: "center", gap: "1rem",
                        padding: "0.8rem 1.4rem",
                        borderBottom: idx < orderItems.length - 1 ? "1px solid #f5f5f5" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "56px", height: "56px",
                          objectFit: "cover", borderRadius: "10px",
                          border: "1px solid #eee",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link
                          to={`/product/${item.product}`}
                          style={{
                            fontWeight: 600, color: "#1b6ca8",
                            textDecoration: "none", fontSize: "14px",
                            display: "block",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </Link>
                        <span style={{ fontSize: "12px", color: "#aaa" }}>
                          {item.quantity} × LKR {item.price?.toLocaleString()}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, color: "#0d7377", fontSize: "15px", flexShrink: 0 }}>
                        LKR {(item.quantity * item.price)?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right — Update Status Card */}
            <div style={{
              background: "#fff", borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
              position: "sticky",
              top: "72px",
            }}>
              <div style={{
                padding: "1rem 1.4rem",
                borderBottom: "1px solid #f0f0f0",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <i className="fa fa-refresh" style={{ color: "#1b6ca8", fontSize: "15px" }} />
                <h6 style={{ margin: 0, fontWeight: 700, color: "#1a2236" }}>Update Status</h6>
              </div>

              <div style={{ padding: "1.4rem" }}>

                {/* Current status badge */}
                <div style={{ marginBottom: "1.2rem" }}>
                  <p style={{ fontSize: "11px", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                    Current Status
                  </p>
                  <span style={{
                    background: s.bg, color: s.color,
                    borderRadius: "20px", padding: "6px 14px",
                    fontSize: "12px", fontWeight: 700,
                    display: "inline-flex", alignItems: "center", gap: "6px",
                  }}>
                    <i className={`fa fa-${statusIcon(orderStatus)}`} style={{ fontSize: "11px" }} />
                    {orderStatus}
                  </span>
                </div>

                {/* Select */}
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "11px", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                    New Status
                  </p>
                  <select
                    value={orderStatus}
                    onChange={e => setOrderStatus(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px",
                      borderRadius: "10px", border: "1.5px solid #e0e7ef",
                      fontSize: "14px", color: "#1a2236",
                      background: "#f8fafd",
                      outline: "none", cursor: "pointer",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231b6ca8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "32px",
                    }}
                    onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                    onBlur={e => e.target.style.borderColor = "#e0e7ef"}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Status flow visual */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  marginBottom: "1.2rem",
                }}>
                  {["Processing", "Shipped", "Delivered"].map((step, i, arr) => {
                    const steps = ["Processing", "Shipped", "Delivered"];
                    const currentIdx = steps.indexOf(orderStatus);
                    const isActive  = i <= currentIdx;
                    const ss = statusStyle(step);
                    return (
                      <Fragment key={step}>
                        <div style={{
                          flex: 1, textAlign: "center",
                          padding: "4px 2px",
                          borderRadius: "6px",
                          background: isActive ? ss.bg : "#f0f0f0",
                          color: isActive ? ss.color : "#bbb",
                          fontSize: "10px", fontWeight: 700,
                          transition: "all 0.2s",
                        }}>
                          <i className={`fa fa-${statusIcon(step)}`} style={{ display: "block", fontSize: "14px", marginBottom: "2px" }} />
                          {step}
                        </div>
                        {i < arr.length - 1 && (
                          <i className="fa fa-angle-right" style={{ color: isActive && i < currentIdx ? "#1b6ca8" : "#ddd", fontSize: "14px" }} />
                        )}
                      </Fragment>
                    );
                  })}
                </div>

                {/* Submit */}
                <button
                  disabled={loading}
                  onClick={submitHandler}
                  style={{
                    width: "100%", padding: "11px",
                    background: loading
                      ? "#ccc"
                      : "linear-gradient(135deg, #1b6ca8, #0d7377)",
                    color: "#fff", border: "none",
                    borderRadius: "10px", fontWeight: 700,
                    fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  {loading
                    ? <><i className="fa fa-spinner fa-spin" /> Updating…</>
                    : <><i className="fa fa-check" /> Update Status</>
                  }
                </button>

                {/* Payment badge */}
                <div style={{
                  marginTop: "1rem",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: isPaid ? "#e0f5f0" : "#fdecea",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <i
                    className={`fa fa-${isPaid ? "check-circle" : "times-circle"}`}
                    style={{ color: isPaid ? "#0d7377" : "#e74c3c", fontSize: "16px" }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: "11px", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Payment
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: isPaid ? "#0d7377" : "#e74c3c" }}>
                      {isPaid ? "Paid" : "Not Paid"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}