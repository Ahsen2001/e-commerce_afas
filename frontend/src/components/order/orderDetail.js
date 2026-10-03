import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { orderDetail as orderDetailAction } from "../../actions/orderActions";
import MetaData from "../layouts/MetaData";

// ================= IMAGE URL HELPER =================
const resolveImageUrl = (image) => {
  if (!image) return "";

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // If backend returns /uploads/...
  if (image.startsWith("/")) {
    return image;
  }

  // If backend returns uploads/...
  return `/${image}`;
};

export default function OrderDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { orderDetail = {}, loading } = useSelector(
    (state) => state.order || {}
  );

  const {
  shippingInfo = {},
  user = {},
  orderStatus = "Processing",
  orderItems = [],
  totalPrice = 0,
  paymentInfo = {},
} = orderDetail;


  const isPaid =
  !!orderDetail?.paidAt ||
  ["succeeded", "paid", "success", "completed"].includes(
    paymentInfo?.status?.toLowerCase()
  );

  useEffect(() => {
    dispatch(orderDetailAction(id));
  }, [dispatch, id]);

  const statusColor = (status) => {
    if (status === "Delivered")
      return { background: "#e0f5f0", color: "#0c9200" };

    if (status === "Shipped")
      return { background: "#e8f0fb", color: "#1b6ca8" };

    if (status === "Processing")
      return { background: "#fff4e0", color: "#b07800" };

    return { background: "#fdecea", color: "#e74c3c" };
  };

  const sectionCard = (style = {}) => ({
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #eee",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    padding: "1.4rem",
    marginBottom: "1.2rem",
    ...style,
  });

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <MetaData title={`Order #${orderDetail._id || ""}`} />

      {/* ================= PAGE HEADER ================= */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
          borderRadius: "14px",
          padding: "1.2rem 1.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
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
              className="fa fa-file-text"
              style={{
                color: "#5ce1e6",
                fontSize: "18px",
              }}
            />
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                margin: 0,
                fontWeight: 700,
              }}
            >
              Order Details
            </h4>

            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            >
              #{orderDetail._id}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              ...statusColor(orderStatus),
              borderRadius: "20px",
              padding: "5px 16px",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            {orderStatus}
          </span>

          <span
            style={{
              background: isPaid ? "#e0f5f0" : "#fdecea",
              color: isPaid ? "#0d7377" : "#e74c3c",
              borderRadius: "20px",
              padding: "5px 16px",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            <i
              className={`fa fa-${
                isPaid ? "check-circle" : "times-circle"
              }`}
              style={{ marginRight: "5px" }}
            />

            {isPaid ? "PAID" : "NOT PAID"}
          </span>
        </div>
      </div>

      <div className="row">

        {/* ================= LEFT COLUMN ================= */}
        <div className="col-12 col-lg-8">

          {/* ================= SHIPPING INFO ================= */}
          <div style={sectionCard()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <i
                className="fa fa-truck"
                style={{
                  color: "#1b6ca8",
                  fontSize: "16px",
                }}
              />

              <h6
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                Shipping Information
              </h6>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {[
                {
                  label: "Customer Name",
                  value: user.name,
                  icon: "fa-user",
                },
                {
                  label: "Phone Number",
                  value: shippingInfo.phoneNo,
                  icon: "fa-phone",
                },
                {
                  label: "City",
                  value: shippingInfo.city,
                  icon: "fa-map-marker",
                },
                {
                  label: "Postal Code",
                  value: shippingInfo.postalCode,
                  icon: "fa-envelope",
                },
                {
                  label: "State",
                  value: shippingInfo.state,
                  icon: "fa-globe",
                },
                {
                  label: "Country",
                  value: shippingInfo.country,
                  icon: "fa-flag",
                },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "10px 14px",
                  }}
                >
                  <div
                    style={{
                      ...labelStyle,
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <i
                      className={`fa ${icon}`}
                      style={{
                        color: "#1b6ca8",
                        fontSize: "11px",
                      }}
                    />

                    {label}
                  </div>

                  <div
                    style={{
                      fontWeight: 600,
                      color: "#1a1a1a",
                      fontSize: "14px",
                    }}
                  >
                    {value || "—"}
                  </div>
                </div>
              ))}
            </div>

            {/* FULL ADDRESS */}
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "8px",
                padding: "10px 14px",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  ...labelStyle,
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <i
                  className="fa fa-home"
                  style={{
                    color: "#1b6ca8",
                    fontSize: "11px",
                  }}
                />

                Full Address
              </div>

              <div
                style={{
                  fontWeight: 600,
                  color: "#1a1a1a",
                  fontSize: "14px",
                }}
              >
                {[
                  shippingInfo.address,
                  shippingInfo.city,
                  shippingInfo.postalCode,
                  shippingInfo.state,
                  shippingInfo.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          </div>

          {/* ================= ORDER ITEMS ================= */}
          <div style={sectionCard()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <i
                className="fa fa-shopping-cart"
                style={{
                  color: "#1b6ca8",
                  fontSize: "16px",
                }}
              />

              <h6
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                Order Items

                <span
                  style={{
                    marginLeft: "8px",
                    background: "#e8f0fb",
                    color: "#1b6ca8",
                    borderRadius: "20px",
                    padding: "2px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {orderItems.length} item
                  {orderItems.length !== 1 ? "s" : ""}
                </span>
              </h6>
            </div>

            {orderItems.map((item, index) => (
              <div
                key={item.product || index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 0",
                  borderBottom:
                    index < orderItems.length - 1
                      ? "1px solid #f5f5f5"
                      : "none",
                }}
              >

                {/* ================= IMAGE ================= */}
                <div
                  style={{
                    width: "70px",
                    height: "60px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1px solid #eee",
                    background: "#f8f9fa",
                  }}
                >
                  {item.image ? (
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name || "Product"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ccc",
                      }}
                    >
                      <i
                        className="fa fa-image"
                        style={{ fontSize: "22px" }}
                      />
                    </div>
                  )}
                </div>

                {/* ================= PRODUCT NAME ================= */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Link
                    to={`/product/${item.product}`}
                    style={{
                      color: "#1b6ca8",
                      fontWeight: 600,
                      fontSize: "14px",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                    }}
                  >
                    {item.name}
                  </Link>
                </div>

                {/* ================= QUANTITY ================= */}
                <div
                  style={{
                    background: "#f0f7ff",
                    borderRadius: "6px",
                    padding: "4px 12px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1b6ca8",
                    flexShrink: 0,
                  }}
                >
                  x{item.quantity}
                </div>

                {/* ================= PRICE ================= */}
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#0d7377",
                    flexShrink: 0,
                    minWidth: "80px",
                    textAlign: "right",
                  }}
                >
                  LKR{" "}
                  {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-12 col-lg-4">

          {/* ================= PAYMENT ================= */}
          <div style={sectionCard()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <i
                className="fa fa-credit-card"
                style={{
                  color: "#1b6ca8",
                  fontSize: "16px",
                }}
              />

              <h6
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                Payment
              </h6>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: isPaid ? "#e0f5f0" : "#fdecea",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: isPaid ? "#0d7377" : "#e74c3c",
                  fontSize: "14px",
                }}
              >
                <i
                  className={`fa fa-${
                    isPaid ? "check-circle" : "times-circle"
                  }`}
                  style={{ marginRight: "6px" }}
                />

                {isPaid
                  ? "Payment Successful"
                  : "Payment Pending"}
              </span>
            </div>

            {paymentInfo?.id && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                Ref: {paymentInfo.id}
              </div>
            )}
          </div>

          {/* ================= ORDER STATUS ================= */}
          <div style={sectionCard()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <i
                className="fa fa-info-circle"
                style={{
                  color: "#1b6ca8",
                  fontSize: "16px",
                }}
              />

              <h6
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                Order Status
              </h6>
            </div>

            <div
              style={{
                ...statusColor(orderStatus),
                borderRadius: "10px",
                padding: "12px 16px",
                fontWeight: 700,
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              <i
                className={`fa fa-${
                  orderStatus === "Delivered"
                    ? "check-circle"
                    : orderStatus === "Shipped"
                    ? "truck"
                    : "cog"
                }`}
                style={{ marginRight: "6px" }}
              />

              {orderStatus}
            </div>
          </div>

          {/* ================= PRICE SUMMARY ================= */}
          <div style={sectionCard()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <i
                className="fa fa-money"
                style={{
                  color: "#1b6ca8",
                  fontSize: "16px",
                }}
              />

              <h6
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                Price Summary
              </h6>
            </div>

            {[
              {
                label: "Subtotal",
                value: orderItems.reduce(
                  (acc, item) =>
                    acc + item.price * item.quantity,
                  0
                ),
              },
              {
                label: "Shipping",
                value:
                  totalPrice -
                  orderItems.reduce(
                    (acc, item) =>
                      acc + item.price * item.quantity,
                    0
                  ),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "8px",
                }}
              >
                <span>{label}</span>

                <span style={{ fontWeight: 600 }}>
                  LKR {value.toLocaleString()}
                </span>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #f0f0f0",
                paddingTop: "10px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontSize: "15px",
                }}
              >
                Total
              </span>

              <span
                style={{
                  fontWeight: 800,
                  fontSize: "18px",
                  background:
                    "linear-gradient(135deg, #0f4c75, #0d7377)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LKR {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ================= BACK BUTTON ================= */}
          <Link
            to="/orders"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background:
                "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
              color: "#fff",
              textDecoration: "none",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <i className="fa fa-arrow-left" />
            Back to My Orders
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

