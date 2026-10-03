import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ collapsed = false }) {
  const location = useLocation();

  const [productOpen, setProductOpen] = useState(
    location.pathname.includes("/admin/product"),
  );

  const sidebarWidth = collapsed ? "72px" : "250px";

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: collapsed ? "0" : "10px",
    padding: "10px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.15s",
    justifyContent: collapsed ? "center" : "flex-start",
    background: isActive(path)
      ? "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))"
      : "transparent",
    color: isActive(path) ? "#fff" : "rgba(255,255,255,0.7)",
    borderLeft: isActive(path) ? "3px solid #5ce1e6" : "3px solid transparent",
    position: "relative",
  });

  const iconStyle = (path) => ({
    fontSize: "16px",
    color: isActive(path) ? "#5ce1e6" : "rgba(255,255,255,0.6)",
    width: "20px",
    textAlign: "center",
    flexShrink: 0,
  });

  const navItems = [
    { label: "Orders", path: "/admin/orders", icon: "fa-file-text" },
    { label: "Users", path: "/admin/users", icon: "fa-users" },
    { label: "Reviews", path: "/admin/reviews", icon: "fa-star" },
    { label: "Vehicles", path: "/admin/vehicle/dashboard", icon: "fa-car" },
    // Add a vehicles accordion same as products:
    { label: "All Vehicles", path: "/admin/vehicles", icon: "fa-list" },
    { label: "Add Vehicle", path: "/admin/vehicle/new", icon: "fa-plus" },
    { label: "Bookings", path: "/admin/vehicle/bookings", icon: "fa-calendar" },
  ];

  return (
    <aside
      style={{
        background:
          "linear-gradient(180deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
        width: sidebarWidth,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "width 0.25s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: collapsed ? "1.2rem 0.6rem" : "1.4rem 1.2rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: "8px",
          transition: "all 0.25s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.15)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            }}
            >
          <i
            className="fa fa-globe"
            style={{ color: "#5ce1e6", fontSize: "16px" }}
          />
        </div>

        {!collapsed && (
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "14px",
                lineHeight: 1.1,
              }}
            >
              TravelVista<span style={{ color: "#5ce1e6" }}>.LK</span>
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "9px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Admin Panel
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        style={{
          padding: collapsed ? "0.5rem 0.4rem" : "0.5rem 0.8rem",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {!collapsed && (
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              padding: "6px 16px 4px",
            }}
          >
            Main
          </div>
        )}

        <Link
          to="/admin/dashboard"
          style={linkStyle("/admin/dashboard")}
          title={collapsed ? "Dashboard" : ""}
          onMouseEnter={(e) => {
            if (!isActive("/admin/dashboard"))
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/dashboard"))
              e.currentTarget.style.background = "transparent";
          }}
        >
          <i
            className="fa fa-tachometer"
            style={iconStyle("/admin/dashboard")}
          />
          {!collapsed && "Dashboard"}
        </Link>

        {!collapsed && (
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              padding: "10px 16px 4px",
            }}
          >
            Manage
          </div>
        )}

        <div>
          <button
            onClick={() => !collapsed && setProductOpen(!productOpen)}
            title={collapsed ? "Products" : ""}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: collapsed ? "0" : "10px",
              justifyContent: collapsed ? "center" : "flex-start",
              padding: "10px",
              borderRadius: "10px",
              background:
                productOpen && !collapsed
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              border: "none",
              cursor: "pointer",
              color: productOpen ? "#fff" : "rgba(255,255,255,0.7)",
              fontSize: "14px",
              fontWeight: 600,
              borderLeft:
                productOpen && !collapsed
                  ? "3px solid #5ce1e6"
                  : "3px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <i
              className="fa fa-shopping-cart"
              style={{
                fontSize: "16px",
                width: "20px",
                textAlign: "center",
                flexShrink: 0,
                color: productOpen ? "#5ce1e6" : "rgba(255,255,255,0.6)",
              }}
            />

            {!collapsed && (
              <>
                <span style={{ flex: 1, textAlign: "left" }}>Products</span>
                <i
                  className={`fa fa-chevron-${productOpen ? "up" : "down"}`}
                  style={{ fontSize: "10px", opacity: 0.6 }}
                />
              </>
            )}
          </button>

          {productOpen && !collapsed && (
            <div
              style={{
                marginLeft: "16px",
                marginTop: "4px",
                borderLeft: "1px solid rgba(255,255,255,0.15)",
                paddingLeft: "12px",
              }}
            >
              {[
                {
                  label: "All Products",
                  path: "/admin/products",
                  icon: "fa-list",
                },
                {
                  label: "Create New",
                  path: "/admin/products/create",
                  icon: "fa-plus-circle",
                },
              ].map(({ label, path, icon }) => (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isActive(path) ? "#5ce1e6" : "rgba(255,255,255,0.6)",
                    background: isActive(path)
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    transition: "all 0.15s",
                    marginBottom: "2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(path)) e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(path))
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  <i
                    className={`fa ${icon}`}
                    style={{
                      fontSize: "12px",
                      width: "14px",
                      textAlign: "center",
                    }}
                  />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {navItems.map(({ label, path, icon }) => (
          <Link
            key={path}
            to={path}
            style={linkStyle(path)}
            title={collapsed ? label : ""}
            onMouseEnter={(e) => {
              if (!isActive(path))
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              if (!isActive(path))
                e.currentTarget.style.background = "transparent";
            }}
          >
            <i className={`fa ${icon}`} style={iconStyle(path)} />
            {!collapsed && label}
          </Link>
        ))}

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            margin: "12px 8px",
          }}
        />

        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
          gap: collapsed ? "0" : "10px",
          justifyContent: collapsed ? "center" : "flex-start",
            padding: "10px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            transition: "all 0.15s",
          borderLeft: "3px solid transparent",
        }}
          title={collapsed ? "Back to Site" : ""}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <i
            className="fa fa-arrow-left"
            style={{
              fontSize: "14px",
              width: "20px",
              textAlign: "center",
              flexShrink: 0,
            }}
          />
          {!collapsed && "Back to Site"}
        </Link>
      </nav>
    </aside>
  );
}
