import { useDispatch } from "react-redux";
import Search from "./Search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { logoutUser } from "../../actions/authActions";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  return (
    <div
      style={{ padding: "12px 20px", position: "sticky", top: 0, zIndex: 1000 }}
    >
      <nav
        style={{
          background:
            "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
          padding: "0 1.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "62px",
          boxShadow: "0 8px 32px rgba(15,76,117,0.35)",
          borderRadius: "16px",
        }}
      >
        {/* Logo / Brand */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "18px",
                lineHeight: 1.1,
                letterSpacing: "0.3px",
              }}
            >
              TravelVista<span style={{ color: "#5ce1e6" }}>.LK</span>
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Smart Tourism
            </div>
          </div>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: "400px", margin: "0 1.5rem" }}>
          <Search />
        </div>

        {/* Right side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          {/* Cart */}
          <Link
            to="/cart"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "rgba(255,255,255,0.9)",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "12px",
              padding: "7px 14px",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
          >
            <i className="fa fa-shopping-cart" style={{ fontSize: "14px" }} />
            <span style={{ fontWeight: 600 }}>Cart</span>
            {cartItems.length > 0 && (
              <span
                style={{
                  background: "#5ce1e6",
                  color: "#0f4c75",
                  borderRadius: "6px",
                  padding: "1px 7px",
                  fontSize: "11px",
                  fontWeight: 800,
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>
          
          {/* Auth */}
          {isAuthenticated ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                style={{
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#fff",
                  padding: "6px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <img
                  src={
                    user.avatar ? user.avatar.url : "/images/default_avatar.png"
                  }
                  alt="avatar"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.95)",
                    maxWidth: "80px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name}
                </span>
                <i
                  className="fa fa-chevron-down"
                  style={{ fontSize: "9px", opacity: 0.6 }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  borderRadius: "14px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                  padding: "8px",
                  minWidth: "170px",
                  marginTop: "8px",
                }}
              >
                {/* User info header */}
                <div
                  style={{
                    padding: "8px 12px 10px",
                    borderBottom: "1px solid #f0f0f0",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{ fontSize: "13px", fontWeight: 700, color: "#222" }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#aaa",
                      marginTop: "2px",
                    }}
                  >
                    {user.email}
        </div>
      </div>
                {user?.role === "admin" && (
                  <Dropdown.Item
                    onClick={() => navigate("/admin/dashboard")}
                    style={{
                      borderRadius: "8px",
                      fontSize: "13px",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="fa fa-dashboard"
                      style={{
                        width: "14px",
                        color: "#1b6ca8",
                        fontSize: "13px",
                      }}
                    />
                    Dashboard
                  </Dropdown.Item>
                )}

                <Dropdown.Item
                  onClick={() => navigate("/myprofile")}
                  style={{
                    borderRadius: "8px",
                    fontSize: "13px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i
                    className="fa fa-user"
                    style={{
                      width: "14px",
                      color: "#1b6ca8",
                      fontSize: "13px",
                    }}
                  />
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => navigate("/itineraries")}
                  style={{
                    borderRadius: "8px",
                    fontSize: "13px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i
                    className="fa fa-book"
                    style={{
                      width: "14px",
                      color: "#1b6ca8",
                      fontSize: "13px",
                    }}
                  />
                  Itinerary Planner
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => navigate("/orders")}
                  style={{
                    borderRadius: "8px",
                    fontSize: "13px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i
                    className="fa fa-archive"
                    style={{
                      width: "14px",
                      color: "#1b6ca8",
                      fontSize: "13px",
                    }}
                  />
                  My Orders
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => navigate("/my/vehicle/bookings")}
                  style={{
                    borderRadius: "8px",
                    fontSize: "13px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i
                    className="fa fa-car"
                    style={{
                      width: "14px",
                      color: "#1b6ca8",
                      fontSize: "13px",
                    }}
                  />
                  My Vehicle Bookings
                </Dropdown.Item>

                <Dropdown.Divider style={{ margin: "4px 0" }} />

                <Dropdown.Item
                  onClick={logoutHandler}
                  style={{
                    borderRadius: "8px",
                    fontSize: "13px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#e74c3c",
                  }}
                >
                  <i
                    className="fa fa-sign-out"
                    style={{
                      width: "14px",
                      color: "#e74c3c",
                      fontSize: "13px",
                    }}
                  />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "12px",
                padding: "8px 18px",
                fontSize: "14px",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
            >
              <i className="fa fa-sign-in" />
              Login
            </Link>
          )}
      </div>
    </nav>
    </div>
  );
}
