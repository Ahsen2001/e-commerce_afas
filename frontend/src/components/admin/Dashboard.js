import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../actions/productActions";
import "../../App.css";
import { getUsers } from "../../actions/authActions";

export default function Dashboard() {
  const { products = [] } = useSelector((state) => state.products || {});
  const { adminOrders = [] } = useSelector((state) => state.order || {});
  const { users = [] } = useSelector((state) => state.user || {});

  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  let outOfStock = 0;
  products.forEach((p) => {
    if (p.stock === 0) outOfStock++;
  });

  let totalAmount = 0;
  adminOrders.forEach((o) => {
    totalAmount += o.totalPrice;
  });

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getUsers());
    dispatch(adminOrdersAction());
  }, [dispatch]);

  const statCards = [
    {
      label: "Total Products",
      value: products.length,
      icon: "fa-shopping-cart",
      colorClass: "admin-stat-icon-blue",
      bgClass: "admin-stat-bg-blue",
      link: "/admin/products",
      linkLabel: "Manage Products",
    },
    {
      label: "Total Orders",
      value: adminOrders.length,
      icon: "fa-file-text",
      colorClass: "admin-stat-icon-green",
      bgClass: "admin-stat-bg-green",
      link: "/admin/orders",
      linkLabel: "Manage Orders",
    },
    {
      label: "Total Users",
      value: users.length,
      icon: "fa-users",
      colorClass: "admin-stat-icon-purple",
      bgClass: "admin-stat-bg-purple",
      link: "/admin/users",
      linkLabel: "Manage Users",
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: "fa-exclamation-triangle",
      colorClass: "admin-stat-icon-red",
      bgClass: "admin-stat-bg-red",
      link: null,
      linkLabel: null,
    },
  ];

  const getOrderStatusClass = (status) => {
    if (status === "Delivered") return "order-status-delivered";
    if (status === "Processing") return "order-status-processing";
    if (status === "Shipped") return "order-status-shipped";
    return "order-status-pending";
  };

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar-wrap ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      <div className="admin-main">
        <div className="admin-topbar">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-toggle-btn"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`fa fa-${sidebarOpen ? "indent" : "dedent"}`} />
          </button>

          <div className="admin-breadcrumb">
            <i className="fa fa-home admin-breadcrumb-home" />
            <span>/</span>
            <span className="admin-breadcrumb-current">Dashboard</span>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-page-header">
            <div className="admin-page-header__icon">
              <i className="fa fa-tachometer" />
            </div>
            <div>
              <h4 className="admin-page-title">Admin Dashboard</h4>
              <p className="admin-page-subtitle">TravelVista.LK — Overview</p>
            </div>
          </div>

          <div className="admin-revenue-card">
            <div className="admin-revenue-left">
              <div className="admin-revenue-icon">
                <i className="fa fa-money" />
              </div>
              <div>
                <div className="admin-revenue-label">Total Revenue</div>
                <div className="admin-revenue-value">
                  LKR {totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="admin-revenue-stats">
              {[
                { label: "This Month", val: `LKR ${(totalAmount * 0.3).toFixed(0)}` },
                {
                  label: "Avg. Order",
                  val: `LKR ${
                    adminOrders.length
                      ? (totalAmount / adminOrders.length).toFixed(0)
                      : 0
                  }`,
                },
              ].map(({ label, val }) => (
                <div key={label} className="admin-revenue-stat-item">
                  <div className="admin-revenue-stat-label">{label}</div>
                  <div className="admin-revenue-stat-value">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-stats-grid">
            {statCards.map(
              ({ label, value, icon, colorClass, bgClass, link, linkLabel }) => (
                <div key={label} className="admin-stat-card">
                  <div className="admin-stat-card__body">
                    <div className="admin-stat-card__top">
                      <div className={`admin-stat-icon-wrap ${bgClass}`}>
                        <i className={`fa ${icon} ${colorClass}`} />
                      </div>
                      <span className={`admin-stat-pill ${bgClass} ${colorClass}`}>
                        TOTAL
                      </span>
                    </div>

                    <div className="admin-stat-value">{value}</div>
                    <div className="admin-stat-label">{label}</div>
                  </div>

                  {link && (
                    <Link to={link} className={`admin-stat-link ${bgClass} ${colorClass}`}>
                      <span>{linkLabel}</span>
                      <i className="fa fa-arrow-right" />
                    </Link>
                  )}
                </div>
              )
            )}
          </div>

          <div className="admin-table-card">
            <div className="admin-table-card__header">
              <div className="admin-table-card__title">
                <i className="fa fa-file-text" />
                <h6>Recent Orders</h6>
              </div>

              <Link to="/admin/orders" className="admin-table-card__link">
                View All <i className="fa fa-arrow-right" />
              </Link>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    {["Order ID", "Items", "Total", "Status"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {adminOrders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td className="admin-table-order-id">
                        #{order._id?.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        {order.orderItems?.length} item
                        {order.orderItems?.length !== 1 ? "s" : ""}
                      </td>
                      <td className="admin-table-price">
                        LKR {order.totalPrice?.toLocaleString()}
                      </td>
                      <td>
                        <span className={`order-status-badge ${getOrderStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {adminOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="admin-table-empty">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}