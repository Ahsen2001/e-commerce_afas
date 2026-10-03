import MetaData from '../layouts/MetaData';
import { Fragment, useEffect } from 'react';
import { validateShipping } from './Shipping';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps';

export default function ConfirmOrder() {
  const { shippingInfo, items: cartItems } = useSelector(state => state.cart || {});
  const { user } = useSelector(state => state.auth || {});
  const navigate = useNavigate();

  const itemsPrice   = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice      = Number(0.05 * itemsPrice).toFixed(2);
  const totalPrice    = Number(itemsPrice + shippingPrice + Number(taxPrice)).toFixed(2);

  const processPayment = () => {
    sessionStorage.setItem('orderInfo', JSON.stringify({ itemsPrice, shippingPrice, taxPrice, totalPrice }));
    navigate('/payment');
  };

  useEffect(() => {
    validateShipping(shippingInfo, navigate);
  }, [shippingInfo, navigate]);

  const summaryRow = (label, icon, value, highlight = false) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid #f0f0f0",
    }}>
      <span style={{ fontSize: "14px", color: "#666" }}>
        <i className={`fa ${icon}`} style={{ marginRight: "6px", color: "#1b6ca8" }} />
        {label}
      </span>
      <span style={{ fontWeight: 700, color: highlight ? "#0d7377" : "#222", fontSize: highlight ? "16px" : "14px" }}>
        LKR {value}
      </span>
    </div>
  );

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps shipping confirmOrder />

      <div className="row d-flex justify-content-between" style={{ marginTop: "1.5rem" }}>

        {/* Left — Shipping + Items */}
        <div className="col-12 col-lg-8">

          {/* Shipping Info Card */}
          <div style={{
            background: "#fff", borderRadius: "12px",
            border: "1px solid #eee", overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: "16px",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
              padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "10px",
            }}>
              <i className="fa fa-shipping-fast" style={{ color: "#5ce1e6", fontSize: "16px" }} />
              <h5 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Shipping Information</h5>
            </div>
            <div style={{ padding: "1.2rem 1.5rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>

                <div style={{
                  flex: "1 1 180px", background: "#f8f9fa",
                  borderRadius: "8px", padding: "10px 14px",
                  border: "1px solid #eee",
                }}>
                  <div style={{ fontSize: "11px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</div>
                  <div style={{ fontWeight: 600, color: "#222", marginTop: "2px" }}>
                    <i className="fa fa-user" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                    {user.name}
                  </div>
                </div>

                <div style={{
                  flex: "1 1 180px", background: "#f8f9fa",
                  borderRadius: "8px", padding: "10px 14px",
                  border: "1px solid #eee",
                }}>
                  <div style={{ fontSize: "11px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone</div>
                  <div style={{ fontWeight: 600, color: "#222", marginTop: "2px" }}>
                    <i className="fa fa-phone" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                    {shippingInfo.phoneNo}
                  </div>
                </div>

                <div style={{
                  flex: "1 1 100%", background: "#f8f9fa",
                  borderRadius: "8px", padding: "10px 14px",
                  border: "1px solid #eee",
                }}>
                  <div style={{ fontSize: "11px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Delivery Address</div>
                  <div style={{ fontWeight: 600, color: "#222", marginTop: "2px" }}>
                    <i className="fa fa-map-marker" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                    {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Cart Items Card */}
          <div style={{
            background: "#fff", borderRadius: "12px",
            border: "1px solid #eee", overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
              padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "10px",
            }}>
              <i className="fa fa-shopping-bag" style={{ color: "#5ce1e6", fontSize: "16px" }} />
              <h5 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                Cart Items
                <span style={{
                  background: "rgba(255,255,255,0.2)", color: "#fff",
                  borderRadius: "12px", padding: "2px 10px",
                  fontSize: "13px", marginLeft: "10px",
                }}>
                  {cartItems.length}
                </span>
              </h5>
            </div>

            <div style={{ padding: "0.5rem 1.2rem" }}>
              {cartItems.map((item, index) => (
                <div key={item.product}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "12px 4px",
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "64px", height: "54px", objectFit: "cover",
                        borderRadius: "8px", border: "1px solid #eee", flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/product/${item.product}`} style={{
                        color: "#1b6ca8", fontWeight: 600, fontSize: "14px",
                        textDecoration: "none", display: "block",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {item.name}
                      </Link>
                      <span style={{ fontSize: "13px", color: "#888" }}>
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "12px", color: "#aaa" }}>
                        {item.quantity} × LKR {item.price}
                      </div>
                      <div style={{ fontWeight: 700, color: "#0d7377", fontSize: "15px" }}>
                        LKR {(item.quantity * item.price).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {index < cartItems.length - 1 && (
                    <hr style={{ margin: 0, borderColor: "#f0f0f0" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right — Order Summary */}
        <div className="col-12 col-lg-4 my-4">
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee",
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            overflow: "hidden", position: "sticky", top: "80px",
          }}>
            {/* Summary Header */}
            <div style={{
              background: "linear-gradient(135deg, #0f4c75, #0d7377)",
              padding: "1rem 1.5rem",
            }}>
              <h5 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                <i className="fa fa-receipt" style={{ marginRight: "8px", color: "#5ce1e6" }} />
                Order Summary
              </h5>
            </div>

            {/* Summary Rows */}
            <div style={{ padding: "1.2rem 1.5rem" }}>
              {summaryRow("Subtotal",  "fa-tag",          itemsPrice,   false)}
              {summaryRow("Shipping",  "fa-truck",        shippingPrice, false)}
              {summaryRow("Tax (5%)",  "fa-percent",      taxPrice,      false)}

              <div style={{ padding: "12px 0 8px" }}>
                {summaryRow("Total",   "fa-credit-card",  totalPrice,    true)}
              </div>

              {shippingPrice === 0 && (
                <div style={{
                  background: "#e8f8f0", color: "#1a7a4a",
                  borderRadius: "8px", padding: "8px 12px",
                  fontSize: "12px", fontWeight: 600, marginBottom: "12px",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <i className="fa fa-check-circle" />
                  Free shipping applied!
                </div>
              )}

              <button
                onClick={processPayment}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                  color: "#fff", border: "none",
                  padding: "13px", borderRadius: "10px",
                  fontSize: "15px", fontWeight: 700,
                  cursor: "pointer", transition: "opacity 0.2s",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  marginTop: "8px",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <i className="fa fa-lock" />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

      </div>
    </Fragment>
  );
}