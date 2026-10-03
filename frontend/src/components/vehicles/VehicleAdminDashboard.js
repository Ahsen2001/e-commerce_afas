import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminVehicles, getAllBookings } from "../../actions/vehicleActions";
import { clearError } from "../../slices/vehicleSlice";
import { toast } from "react-toastify";
import Sidebar from "../admin/Sidebar";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";

const statusColors = {
  Pending:   { bg: "#fff4e0", color: "#b07800" },
  Confirmed: { bg: "#e0f5f0", color: "#0d7377" },
  Cancelled: { bg: "#fdecea", color: "#e74c3c" },
  Completed: { bg: "#e8f0fb", color: "#1b6ca8" },
};

export default function VehicleAdminDashboard() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    vehicles = [],
    allBookings = [],
    loading,
    error,
  } = useSelector((s) => s.vehicle || {});

  useEffect(() => {
    dispatch(getAdminVehicles());
    dispatch(getAllBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ── Stats ──
  const totalRevenue    = allBookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const totalVehicles   = vehicles.length;
  const available       = vehicles.filter((v) => v.available).length;
  const unavailable     = vehicles.filter((v) => !v.available).length;
  const totalBookings   = allBookings.length;
  const pendingBookings = allBookings.filter((b) => b.status === "Pending").length;
  const confirmedBookings = allBookings.filter((b) => b.status === "Confirmed").length;
  const completedBookings = allBookings.filter((b) => b.status === "Completed").length;

  // ── Vehicle type breakdown ──
  const typeCount = vehicles.reduce((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {});

  const typeIcons = {
    Car: "fa-car", Van: "fa-bus", Bike: "fa-motorcycle",
    Bus: "fa-bus", SUV: "fa-truck", "Tuk-Tuk": "fa-taxi",
  };

  const statCards = [
    {
      label: "Total Vehicles", value: totalVehicles,
      icon: "fa-car", color: "#1b6ca8", bg: "#e8f0fb",
      link: "/admin/vehicles", linkLabel: "Manage Vehicles",
    },
    {
      label: "Total Bookings", value: totalBookings,
      icon: "fa-calendar", color: "#0d7377", bg: "#e0f5f5",
      link: "/admin/vehicle/bookings", linkLabel: "View Bookings",
    },
    {
      label: "Available",  value: available,
      icon: "fa-check-circle", color: "#27ae60", bg: "#e0f5e9",
      link: null, linkLabel: null,
    },
    {
      label: "Unavailable", value: unavailable,
      icon: "fa-times-circle", color: "#e74c3c", bg: "#fdecea",
      link: null, linkLabel: null,
    },
  ];

  return (
    <>
      <MetaData title="Vehicle Admin — TravelVista.LK" />
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
              <span style={{ color: "#555" }}>Vehicles</span>
              <span>/</span>
              <span style={{ color: "#1b6ca8", fontWeight: 600 }}>Dashboard</span>
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              <Link
                to="/admin/vehicle/new"
                style={{
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  color: "#fff", textDecoration: "none",
                  padding: "7px 14px", borderRadius: "8px",
                  fontSize: "12px", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                <i className="fa fa-plus" /> Add Vehicle
              </Link>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "1.5rem 1.8rem", flex: 1 }}>

            {/* Page Header */}
            <div style={{
              background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
              borderRadius: "14px", padding: "1.2rem 1.8rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 16px rgba(15,76,117,0.2)",
              flexWrap: "wrap", gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className="fa fa-car" style={{ color: "#5ce1e6", fontSize: "20px" }} />
                </div>
                <div>
                  <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Vehicle Dashboard</h4>
                  <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
                    TravelVista.LK — Rental Overview
                  </p>
                </div>
              </div>

              {/* Revenue badge */}
              <div style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px", padding: "10px 18px",
                textAlign: "right",
              }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Revenue
                </div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#5ce1e6" }}>
                  LKR {totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            {loading ? <Loader /> : (
              <>

                {/* Stat Cards */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                  marginBottom: "1.5rem",
                }}>
                  {statCards.map(({ label, value, icon, color, bg, link, linkLabel }) => (
                    <div key={label} style={{
                      background: "#fff", borderRadius: "14px",
                      border: "1px solid #eee",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      overflow: "hidden", display: "flex", flexDirection: "column",
                    }}>
                      <div style={{ padding: "1.2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                          <div style={{
                            width: "42px", height: "42px", borderRadius: "10px",
                            background: bg, display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>
                            <i className={`fa ${icon}`} style={{ color, fontSize: "18px" }} />
                          </div>
                          <span style={{
                            fontSize: "11px", fontWeight: 700, color,
                            background: bg, borderRadius: "6px",
                            padding: "3px 8px",
                          }}>
                            TOTAL
                          </span>
                        </div>
                        <div style={{ fontSize: "30px", fontWeight: 800, color: "#1a1a1a", lineHeight: 1 }}>
                          {value}
                        </div>
                        <div style={{ fontSize: "13px", color: "#888", marginTop: "4px", fontWeight: 600 }}>
                          {label}
                        </div>
                      </div>
                      {link && (
                        <Link to={link} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 14px", textDecoration: "none",
                          borderTop: "1px solid #f0f0f0",
                          color, fontSize: "12px", fontWeight: 700,
                          background: bg, transition: "opacity 0.2s",
                          marginTop: "auto",
                        }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          <span>{linkLabel}</span>
                          <i className="fa fa-arrow-right" style={{ fontSize: "11px" }} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* ── Two Column Row ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "1.5rem" }}>

                  {/* Booking Status Breakdown */}
                  <div style={{
                    background: "#fff", borderRadius: "14px",
                    border: "1px solid #eee",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                      padding: "0.9rem 1.2rem",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <i className="fa fa-pie-chart" style={{ color: "#5ce1e6", fontSize: "14px" }} />
                      <h6 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Booking Status</h6>
                    </div>
                    <div style={{ padding: "1.2rem" }}>
                      {[
                        { label: "Pending",   value: pendingBookings,   ...statusColors.Pending   },
                        { label: "Confirmed", value: confirmedBookings, ...statusColors.Confirmed },
                        { label: "Completed", value: completedBookings, ...statusColors.Completed },
                        { label: "Cancelled", value: allBookings.filter(b => b.status === "Cancelled").length, ...statusColors.Cancelled },
                      ].map(({ label, value, bg, color }) => (
                        <div key={label} style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
                            <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>{label}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {/* Progress bar */}
                            <div style={{ width: "80px", height: "6px", borderRadius: "10px", background: "#f0f0f0", overflow: "hidden" }}>
                              <div style={{
                                height: "100%", borderRadius: "10px",
                                background: color,
                                width: totalBookings > 0 ? `${(value / totalBookings) * 100}%` : "0%",
                                transition: "width 0.5s",
                              }} />
                            </div>
                            <span style={{
                              background: bg, color,
                              borderRadius: "6px", padding: "2px 8px",
                              fontSize: "12px", fontWeight: 700,
                              minWidth: "24px", textAlign: "center",
                            }}>
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Type Breakdown */}
                  <div style={{
                    background: "#fff", borderRadius: "14px",
                    border: "1px solid #eee",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                      padding: "0.9rem 1.2rem",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <i className="fa fa-bar-chart" style={{ color: "#5ce1e6", fontSize: "14px" }} />
                      <h6 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Fleet by Type</h6>
                    </div>
                    <div style={{ padding: "1.2rem" }}>
                      {Object.entries(typeCount).length === 0 ? (
                        <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center", padding: "1rem" }}>
                          No vehicles added yet
                        </p>
                      ) : (
                        Object.entries(typeCount).map(([type, count]) => (
                          <div key={type} style={{
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{
                                width: "30px", height: "30px", borderRadius: "8px",
                                background: "#e8f0fb",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <i className={`fa ${typeIcons[type] || "fa-car"}`}
                                  style={{ fontSize: "13px", color: "#1b6ca8" }} />
                              </div>
                              <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>{type}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "80px", height: "6px", borderRadius: "10px", background: "#f0f0f0", overflow: "hidden" }}>
                                <div style={{
                                  height: "100%", borderRadius: "10px",
                                  background: "linear-gradient(135deg, #1b6ca8, #0d7377)",
                                  width: `${(count / totalVehicles) * 100}%`,
                                  transition: "width 0.5s",
                                }} />
                              </div>
                              <span style={{
                                background: "#e8f0fb", color: "#1b6ca8",
                                borderRadius: "6px", padding: "2px 8px",
                                fontSize: "12px", fontWeight: 700,
                                minWidth: "24px", textAlign: "center",
                              }}>
                                {count}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Recent Bookings Table ── */}
                <div style={{
                  background: "#fff", borderRadius: "14px",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  marginBottom: "1.5rem",
                }}>
                  <div style={{
                    background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                    padding: "1rem 1.5rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="fa fa-calendar" style={{ color: "#5ce1e6", fontSize: "15px" }} />
                      <h6 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Recent Bookings</h6>
                    </div>
                    <Link to="/admin/vehicle/bookings" style={{
                      color: "#5ce1e6", fontSize: "12px", fontWeight: 700,
                      textDecoration: "none",
                      display: "flex", alignItems: "center", gap: "5px",
                    }}>
                      View All <i className="fa fa-arrow-right" style={{ fontSize: "11px" }} />
                    </Link>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "#f8f9fa" }}>
                          {["Booking ID", "Vehicle", "Customer", "Duration", "Total", "Status"].map((h) => (
                            <th key={h} style={{
                              padding: "10px 16px", textAlign: "left",
                              fontWeight: 700, color: "#888",
                              fontSize: "11px", textTransform: "uppercase",
                              letterSpacing: "0.5px", borderBottom: "1px solid #eee",
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allBookings.slice(0, 6).map((booking) => {
                          const sc = statusColors[booking.status] || statusColors.Pending;
                          return (
                            <tr
                              key={booking._id}
                              style={{ borderBottom: "1px solid #f5f5f5" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <td style={{ padding: "12px 16px", color: "#1b6ca8", fontWeight: 600, fontFamily: "monospace", fontSize: "12px" }}>
                                #{booking._id?.slice(-8).toUpperCase()}
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{
                                    width: "32px", height: "28px", borderRadius: "6px",
                                    background: "#f0f4f8", overflow: "hidden",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                  }}>
                                    {booking.vehicle?.images?.[0]?.image ? (
                                      <img src={booking.vehicle.images[0].image} alt=""
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                      <i className="fa fa-car" style={{ fontSize: "12px", color: "#1b6ca8", opacity: 0.4 }} />
                                    )}
                                  </div>
                                  <span style={{ fontWeight: 600, color: "#333", fontSize: "13px" }}>
                                    {booking.vehicle?.name || "—"}
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: "12px 16px", color: "#555" }}>
                                <div style={{ fontWeight: 600, color: "#333", fontSize: "13px" }}>
                                  {booking.user?.name || "—"}
                                </div>
                                <div style={{ fontSize: "11px", color: "#aaa" }}>
                                  {booking.user?.email || ""}
                                </div>
                              </td>
                              <td style={{ padding: "12px 16px", color: "#555" }}>
                                <div style={{ fontSize: "12px", fontWeight: 600 }}>
                                  {new Date(booking.pickupDate).toLocaleDateString()} →
                                </div>
                                <div style={{ fontSize: "12px", color: "#888" }}>
                                  {new Date(booking.returnDate).toLocaleDateString()}
                                </div>
                                <span style={{
                                  background: "#f0f7ff", color: "#1b6ca8",
                                  borderRadius: "4px", padding: "1px 6px",
                                  fontSize: "10px", fontWeight: 700,
                                }}>
                                  {booking.totalDays} day{booking.totalDays !== 1 ? "s" : ""}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0d7377", fontSize: "14px" }}>
                                LKR {booking.totalPrice?.toLocaleString()}
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <span style={{
                                  background: sc.bg, color: sc.color,
                                  borderRadius: "20px", padding: "4px 12px",
                                  fontSize: "11px", fontWeight: 700,
                                }}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {allBookings.length === 0 && (
                          <tr>
                            <td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: "#aaa" }}>
                              <i className="fa fa-calendar-o" style={{ fontSize: "32px", display: "block", marginBottom: "8px", opacity: 0.4 }} />
                              No bookings yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Vehicle Fleet Table ── */}
                <div style={{
                  background: "#fff", borderRadius: "14px",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                    padding: "1rem 1.5rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="fa fa-car" style={{ color: "#5ce1e6", fontSize: "15px" }} />
                      <h6 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Vehicle Fleet</h6>
                    </div>
                    <Link to="/admin/vehicles" style={{
                      color: "#5ce1e6", fontSize: "12px", fontWeight: 700,
                      textDecoration: "none",
                      display: "flex", alignItems: "center", gap: "5px",
                    }}>
                      Manage All <i className="fa fa-arrow-right" style={{ fontSize: "11px" }} />
                    </Link>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "#f8f9fa" }}>
                          {["Vehicle", "Type", "Seats", "Price/Day", "Location", "Status"].map((h) => (
                            <th key={h} style={{
                              padding: "10px 16px", textAlign: "left",
                              fontWeight: 700, color: "#888",
                              fontSize: "11px", textTransform: "uppercase",
                              letterSpacing: "0.5px", borderBottom: "1px solid #eee",
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.slice(0, 6).map((v) => (
                          <tr
                            key={v._id}
                            style={{ borderBottom: "1px solid #f5f5f5" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                  width: "40px", height: "36px", borderRadius: "8px",
                                  background: "#f0f4f8", overflow: "hidden",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  flexShrink: 0,
                                }}>
                                  {v.images?.[0]?.image ? (
                                    <img src={v.images[0].image} alt={v.name}
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  ) : (
                                    <i className={`fa ${typeIcons[v.type] || "fa-car"}`}
                                      style={{ fontSize: "14px", color: "#1b6ca8", opacity: 0.4 }} />
                                  )}
                                </div>
                                <span style={{ fontWeight: 600, color: "#333" }}>{v.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{
                                background: "#e8f0fb", color: "#1b6ca8",
                                borderRadius: "20px", padding: "3px 10px",
                                fontSize: "11px", fontWeight: 700,
                                display: "inline-flex", alignItems: "center", gap: "4px",
                              }}>
                                <i className={`fa ${typeIcons[v.type] || "fa-car"}`} style={{ fontSize: "10px" }} />
                                {v.type}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#555" }}>
                              <i className="fa fa-users" style={{ marginRight: "4px", color: "#1b6ca8", fontSize: "11px" }} />
                              {v.seats}
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0d7377" }}>
                              LKR {v.pricePerDay?.toLocaleString()}
                            </td>
                            <td style={{ padding: "12px 16px", color: "#555" }}>
                              <i className="fa fa-map-marker" style={{ marginRight: "4px", color: "#1b6ca8", fontSize: "11px" }} />
                              {v.location}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{
                                background: v.available ? "#e0f5f0" : "#fdecea",
                                color: v.available ? "#0d7377" : "#e74c3c",
                                borderRadius: "20px", padding: "3px 10px",
                                fontSize: "11px", fontWeight: 700,
                              }}>
                                {v.available ? "Available" : "Unavailable"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {vehicles.length === 0 && (
                          <tr>
                            <td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: "#aaa" }}>
                              <i className="fa fa-car" style={{ fontSize: "32px", display: "block", marginBottom: "8px", opacity: 0.4 }} />
                              No vehicles added yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}