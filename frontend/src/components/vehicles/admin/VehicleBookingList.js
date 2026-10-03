import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings, updateBooking, deleteBooking } from "../../../actions/vehicleActions";
import { clearError, clearBookingUpdated, clearBookingDeleted } from "../../../slices/vehicleSlice";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import Sidebar from "../../admin/Sidebar";
import Loader from "../../layouts/Loader";
import MetaData from "../../layouts/MetaData";

const statusColors = {
  Pending:   { bg: "#fff4e0", color: "#b07800" },
  Confirmed: { bg: "#e0f5f0", color: "#0d7377" },
  Cancelled: { bg: "#fdecea", color: "#e74c3c" },
  Completed: { bg: "#e8f0fb", color: "#1b6ca8" },
};

export default function VehicleBookingList() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { allBookings = [], loading, error, isBookingUpdated, isBookingDeleted } =
    useSelector((s) => s.vehicle || {});

  useEffect(() => { dispatch(getAllBookings()); }, [dispatch]);

  useEffect(() => {
    if (error) { toast.error(error, { position: "bottom-center" }); dispatch(clearError()); return; }
    if (isBookingUpdated) { toast.success("Booking updated!", { position: "bottom-center" }); dispatch(clearBookingUpdated()); dispatch(getAllBookings()); }
    if (isBookingDeleted) { toast.success("Booking deleted!", { position: "bottom-center" }); dispatch(clearBookingDeleted()); dispatch(getAllBookings()); }
  }, [error, isBookingUpdated, isBookingDeleted, dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateBooking(id, { status }));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this booking?")) return;
    dispatch(deleteBooking(id));
  };

  const setBookings = () => ({
    columns: [
      { label: "Booking ID", field: "id",       sort: "asc" },
      { label: "Vehicle",    field: "vehicle",  sort: "asc" },
      { label: "Customer",   field: "customer", sort: "asc" },
      { label: "Duration",   field: "duration", sort: "asc" },
      { label: "Total",      field: "total",    sort: "asc" },
      { label: "Status",     field: "status",   sort: "asc" },
      { label: "Actions",    field: "actions",  sort: "asc" },
    ],
    rows: allBookings.map((b) => {
      const sc = statusColors[b.status] || statusColors.Pending;
      return {
        id: (
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#1b6ca8", fontWeight: 600 }}>
            #{b._id?.slice(-8).toUpperCase()}
          </span>
        ),
        vehicle: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "36px", height: "32px", borderRadius: "6px",
              background: "#f0f4f8", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {b.vehicle?.images?.[0]?.image ? (
                <img src={b.vehicle.images[0].image} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <i className="fa fa-car" style={{ fontSize: "13px", color: "#1b6ca8", opacity: 0.4 }} />
              )}
            </div>
            <span style={{ fontWeight: 600, color: "#333", fontSize: "13px" }}>
              {b.vehicle?.name || "—"}
            </span>
          </div>
        ),
        customer: (
          <div>
            <div style={{ fontWeight: 600, color: "#333", fontSize: "13px" }}>{b.user?.name || "—"}</div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>{b.user?.email || ""}</div>
          </div>
        ),
        duration: (
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}>
              {new Date(b.pickupDate).toLocaleDateString()} →
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              {new Date(b.returnDate).toLocaleDateString()}
            </div>
            <span style={{
              background: "#f0f7ff", color: "#1b6ca8",
              borderRadius: "4px", padding: "1px 6px",
              fontSize: "10px", fontWeight: 700,
            }}>
              {b.totalDays} day{b.totalDays !== 1 ? "s" : ""}
            </span>
          </div>
        ),
        total: (
          <span style={{ fontWeight: 700, color: "#0d7377", fontSize: "14px" }}>
            LKR {b.totalPrice?.toLocaleString()}
          </span>
        ),
        status: (
          <select
            value={b.status}
            onChange={(e) => handleStatusChange(b._id, e.target.value)}
            style={{
              background: sc.bg, color: sc.color,
              border: `1px solid ${sc.color}30`,
              borderRadius: "20px", padding: "4px 10px",
              fontSize: "11px", fontWeight: 700,
              cursor: "pointer", outline: "none",
              fontFamily: "inherit",
            }}
          >
            {["Pending", "Confirmed", "Cancelled", "Completed"].map((s) => (
              <option key={s} value={s} style={{ background: "#fff", color: "#333" }}>{s}</option>
            ))}
          </select>
        ),
        actions: (
          <button
            onClick={() => handleDelete(b._id)}
            title="Delete Booking"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px", borderRadius: "8px",
              background: "#fdecea", border: "1px solid #fcd0ce",
              color: "#e74c3c", cursor: "pointer",
            }}
          >
            <i className="fa fa-trash" style={{ fontSize: "13px" }} />
          </button>
        ),
      };
    }),
  });

  const totalRevenue = allBookings.reduce((acc, b) => acc + b.totalPrice, 0);

  return (
    <>
      <MetaData title="Vehicle Bookings — Admin" />
      <div style={{ display: "flex", minHeight: "100vh" }}>

        <div style={{ width: sidebarOpen ? "220px" : "64px", flexShrink: 0, transition: "width 0.25s ease", overflow: "hidden" }}>
          <Sidebar collapsed={!sidebarOpen} />
        </div>

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
              style={{ background: "none", border: "none", cursor: "pointer", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "16px" }}
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
              <span style={{ color: "#1b6ca8", fontWeight: 600 }}>Bookings</span>
            </div>

            {/* Summary pills */}
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "Total",     value: allBookings.length,                                       bg: "#e8f0fb", color: "#1b6ca8" },
                { label: "Pending",   value: allBookings.filter(b => b.status === "Pending").length,   bg: "#fff4e0", color: "#b07800" },
                { label: "Confirmed", value: allBookings.filter(b => b.status === "Confirmed").length, bg: "#e0f5f0", color: "#0d7377" },
              ].map(({ label, value, bg, color }) => (
                <span key={label} style={{ background: bg, color, borderRadius: "6px", padding: "4px 12px", fontSize: "12px", fontWeight: 700 }}>
                  {label}: {value}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "1.5rem 1.8rem", flex: 1 }}>

            {/* Revenue banner */}
            <div style={{
              background: "#fff", borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              padding: "1.2rem 1.8rem",
              display: "flex", alignItems: "center", gap: "14px",
              marginBottom: "1.5rem",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i className="fa fa-money" style={{ color: "#5ce1e6", fontSize: "20px" }} />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Rental Revenue
                </div>
                <div style={{
                  fontSize: "26px", fontWeight: 800,
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  LKR {totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{
              background: "#fff", borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                padding: "1rem 1.5rem",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <i className="fa fa-calendar" style={{ color: "#5ce1e6", fontSize: "15px" }} />
                <h6 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                  All Vehicle Bookings
                </h6>
                <span style={{
                  marginLeft: "auto", background: "rgba(255,255,255,0.15)",
                  color: "#fff", borderRadius: "20px",
                  padding: "2px 10px", fontSize: "11px", fontWeight: 700,
                }}>
                  {allBookings.length} total
                </span>
              </div>
              {loading ? <Loader /> : (
                <MDBDataTable
                  data={setBookings()}
                  bordered striped hover
                  className="px-3"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}