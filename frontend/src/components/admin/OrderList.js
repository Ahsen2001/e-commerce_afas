import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function OrderList() {
  const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector(
    (state) => state.order || {}
  );

  const dispatch    = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const statusStyle = (status) => {
    if (status === "Delivered")  return { bg: "#e0f5f0", color: "#0d7377"  };
    if (status === "Shipped")    return { bg: "#e8f0fb", color: "#1b6ca8"  };
    if (status === "Processing") return { bg: "#fff4e0", color: "#b07800"  };
    return                              { bg: "#fdecea", color: "#e74c3c"  };
  };

  const setOrders = () => {
    const data = {
      columns: [
        { label: "Order ID",    field: "id",        sort: "asc" },
        { label: "Items",       field: "noOfItems", sort: "asc" },
        { label: "Amount",      field: "amount",    sort: "asc" },
        { label: "Status",      field: "status",    sort: "asc" },
        { label: "Actions",     field: "actions",   sort: "asc" },
      ],
      rows: [],
    };

    adminOrders.forEach((order) => {
      const s = statusStyle(order.orderStatus);
      data.rows.push({
        id: (
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#1b6ca8", fontWeight: 600 }}>
            #{order._id?.slice(-8).toUpperCase()}
          </span>
        ),
        noOfItems: (
          <span style={{
            background: "#f0f7ff", color: "#1b6ca8",
            borderRadius: "6px", padding: "3px 10px",
            fontSize: "12px", fontWeight: 700,
          }}>
            {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
          </span>
        ),
        amount: (
          <span style={{ fontWeight: 700, color: "#0d7377", fontSize: "14px" }}>
            LKR {order.totalPrice?.toLocaleString()}
          </span>
        ),
        status: (
          <span style={{
            background: s.bg, color: s.color,
            borderRadius: "20px", padding: "4px 12px",
            fontSize: "11px", fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: "5px",
          }}>
            <i className={`fa fa-${
              order.orderStatus === "Delivered"  ? "check-circle"
              : order.orderStatus === "Shipped"  ? "truck"
              : "cog"
            }`} style={{ fontSize: "10px" }} />
            {order.orderStatus}
          </span>
        ),
        actions: (
          <div style={{ display: "flex", gap: "6px" }}>
            <Link
              to={`/admin/order/${order._id}`}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "8px",
                background: "linear-gradient(135deg, #1b6ca8, #0d7377)",
                color: "#fff", textDecoration: "none",
              }}
              title="Edit Order"
            >
              <i className="fa fa-pencil" style={{ fontSize: "13px" }} />
            </Link>
            <button
              onClick={(e) => deleteHandler(e, order._id)}
              title="Delete Order"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "8px",
                background: "#fdecea", border: "1px solid #fcd0ce",
                color: "#e74c3c", cursor: "pointer",
              }}
            >
              <i className="fa fa-trash" style={{ fontSize: "13px" }} />
            </button>
          </div>
        ),
      });
    });

    return data;
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteOrder(id));
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
    if (isOrderDeleted) {
      toast("Order deleted successfully!", {
        type: "success",
        position:"bottom-center",
        onOpen: () => dispatch(clearOrderDeleted()),
      });
      return;
    }
    dispatch(adminOrdersAction());  // ✅ fixed — was missing ()
  }, [dispatch, error, isOrderDeleted]);

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
            <span style={{ color: "#1b6ca8", fontWeight: 600 }}>Order List</span>
          </div>

          {/* Summary pills */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "Total",      value: adminOrders.length,                                                         bg: "#e8f0fb", color: "#1b6ca8" },
              { label: "Processing", value: adminOrders.filter(o => o.orderStatus === "Processing").length,             bg: "#fff4e0", color: "#b07800" },
              { label: "Delivered",  value: adminOrders.filter(o => o.orderStatus === "Delivered").length,              bg: "#e0f5f0", color: "#0d7377" },
            ].map(({ label, value, bg, color }) => (
              <span key={label} style={{
                background: bg, color, borderRadius: "6px",
                padding: "4px 12px", fontSize: "12px", fontWeight: 700,
              }}>
                {label}: {value}
              </span>
            ))}
          </div>
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
              <i className="fa fa-file-text" style={{ color: "#5ce1e6", fontSize: "20px" }} />
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Order List</h4>
              <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
                {adminOrders.length} order{adminOrders.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>

          {/* Table Card */}
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}>
            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setOrders()}
                bordered
                striped
                hover
                className="px-3"
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}