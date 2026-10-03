import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  decreaseCartItemQty,
  increaseCartItemQty,
  removeItemFromCart,
} from "../../slices/cartSlice";

export default function Cart() {
  const { items } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increaseQty = (item) => {
    if (item.stock === 0 || item.quantity >= item.stock) return;
    dispatch(increaseCartItemQty(item.product));
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) return;
    dispatch(decreaseCartItemQty(item.product));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <Fragment>
      {items.length === 0 ? (

        /* ── Empty State ── */
        <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
          <div style={{
            width: "90px", height: "90px", borderRadius: "50%",
            background: "linear-gradient(135deg, #0f4c75, #0d7377)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}>
            <i className="fa fa-shopping-cart" style={{ fontSize: "36px", color: "#fff" }} />
          </div>
          <h3 style={{ fontWeight: 700, color: "#222" }}>Your Cart is Empty</h3>
          <p style={{ color: "#888", marginBottom: "1.5rem" }}>
            Looks like you haven't added anything yet.
          </p>
          <Link to="/" style={{
            background: "linear-gradient(135deg, #0f4c75, #0d7377)",
            color: "#fff", textDecoration: "none",
            padding: "10px 28px", borderRadius: "25px",
            fontWeight: 600, fontSize: "14px",
          }}>
            <i className="fa fa-arrow-left" style={{ marginRight: "8px" }} />
            Browse Products
          </Link>
        </div>

      ) : (
        <Fragment>

          {/* Page Title */}
          <div style={{
            background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
            borderRadius: "12px", padding: "1.2rem 1.8rem",
            display: "flex", alignItems: "center", gap: "12px",
            margin: "1.5rem 0",
          }}>
            <i className="fa fa-shopping-cart" style={{ color: "#5ce1e6", fontSize: "20px" }} />
            <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
              Your Cart —{" "}
              <span style={{ color: "#5ce1e6" }}>{items.length} {items.length === 1 ? "item" : "items"}</span>
            </h4>
          </div>

          <div className="row d-flex justify-content-between">

            {/* Cart Items */}
            <div className="col-12 col-lg-8">
              {items.map((item) => (
                <div key={item.product} style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  padding: "1rem 1.2rem",
                  marginBottom: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  <div className="row align-items-center">

                    {/* Image */}
                    <div className="col-4 col-lg-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "80px", height: "70px",
                          objectFit: "cover", borderRadius: "8px",
                          border: "1px solid #eee",
                        }}
                      />
                    </div>

                    {/* Name */}
                    <div className="col-8 col-lg-3">
                      <Link to={`/product/${item.product}`} style={{
                        color: "#1b6ca8", fontWeight: 600,
                        fontSize: "14px", textDecoration: "none",
                      }}>
                        {item.name}
                      </Link>
                    </div>

                    {/* Price */}
                    <div className="col-6 col-lg-2 mt-3 mt-lg-0">
                      <span style={{
                        color: "#0d7377", fontWeight: 700,
                        fontSize: "15px",
                      }}>
                        LKR {item.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Counter */}
                    <div className="col-6 col-lg-3 mt-3 mt-lg-0">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button
                          onClick={() => decreaseQty(item)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            border: "1.5px solid #1b6ca8", background: "#fff",
                            color: "#1b6ca8", fontWeight: 700, fontSize: "16px",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            lineHeight: 1,
                          }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          readOnly
                          value={item.quantity}
                          style={{
                            width: "40px", textAlign: "center",
                            border: "1.5px solid #e0e0e0", borderRadius: "6px",
                            padding: "4px", fontWeight: 700, fontSize: "14px",
                          }}
                        />
                        <button
                          onClick={() => increaseQty(item)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            border: "none",
                            background: "linear-gradient(135deg, #1b6ca8, #0d7377)",
                            color: "#fff", fontWeight: 700, fontSize: "16px",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            lineHeight: 1,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="col-12 col-lg-1 mt-3 mt-lg-0 text-lg-center">
                      <button
                        onClick={() => dispatch(removeItemFromCart(item.product))}
                        style={{
                          background: "#fff1f0", border: "1px solid #ffd5d5",
                          borderRadius: "8px", padding: "6px 10px",
                          color: "#e74c3c", cursor: "pointer", fontSize: "14px",
                        }}
                        title="Remove item"
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-12 col-lg-4 my-4">
              <div style={{
                background: "#fff", borderRadius: "14px",
                border: "1px solid #eee",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                overflow: "hidden",
                position: "sticky", top: "80px",
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

                {/* Summary Body */}
                <div style={{ padding: "1.2rem 1.5rem" }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginBottom: "10px", fontSize: "14px", color: "#555",
                  }}>
                    <span>Total Items</span>
                    <span style={{ fontWeight: 700, color: "#222" }}>{totalUnits} Units</span>
                  </div>

                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginBottom: "10px", fontSize: "14px", color: "#555",
                  }}>
                    <span>Products</span>
                    <span style={{ fontWeight: 700, color: "#222" }}>{items.length}</span>
                  </div>

                  <hr style={{ borderColor: "#eee" }} />

                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginBottom: "1.2rem", fontSize: "16px",
                  }}>
                    <span style={{ fontWeight: 700, color: "#222" }}>Est. Total</span>
                    <span style={{ fontWeight: 700, color: "#0d7377", fontSize: "17px" }}>
                      LKR {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={checkoutHandler}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                      color: "#fff", border: "none",
                      padding: "13px", borderRadius: "10px",
                      fontSize: "15px", fontWeight: 700,
                      cursor: "pointer", transition: "opacity 0.2s",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "8px",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <i className="fa fa-lock" />
                    Proceed to Checkout
                  </button>

                  <Link to="/" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "6px", marginTop: "10px", color: "#1b6ca8",
                    fontSize: "13px", textDecoration: "none", fontWeight: 600,
                  }}>
                    <i className="fa fa-arrow-left" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </Fragment>
      )}
    </Fragment>
  );
}