import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminVehicles, deleteVehicle } from "../../../actions/vehicleActions";
import { clearError, clearVehicleDeleted } from "../../../slices/vehicleSlice";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import Sidebar from "../../admin/Sidebar";
import Loader from "../../layouts/Loader";
import MetaData from "../../layouts/MetaData";

const typeIcons = {
  Car: "fa-car", Van: "fa-bus", Bike: "fa-motorcycle",
  Bus: "fa-bus", SUV: "fa-truck", "Tuk-Tuk": "fa-taxi",
};

export default function VehicleAdminList() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { vehicles = [], loading, error, isVehicleDeleted } = useSelector(
    (s) => s.vehicle || {}
  );

  useEffect(() => {
    dispatch(getAdminVehicles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
      return;
    }
    if (isVehicleDeleted) {
      toast.success("Vehicle deleted successfully!", { position: "bottom-center" });
      dispatch(clearVehicleDeleted());
      dispatch(getAdminVehicles());
    }
  }, [error, isVehicleDeleted, dispatch]);

  const deleteHandler = (id) => {
    if (!window.confirm("Delete this vehicle? This cannot be undone.")) return;
    dispatch(deleteVehicle(id));
  };

  const setVehicles = () => ({
    columns: [
      { label: "Vehicle",   field: "vehicle",   sort: "asc" },
      { label: "Type",      field: "type",      sort: "asc" },
      { label: "Price/Day", field: "price",     sort: "asc" },
      { label: "Seats",     field: "seats",     sort: "asc" },
      { label: "Location",  field: "location",  sort: "asc" },
      { label: "Status",    field: "status",    sort: "asc" },
      { label: "Actions",   field: "actions",   sort: "asc" },
    ],
    rows: vehicles.map((v) => ({
      vehicle: (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "44px", height: "38px", borderRadius: "8px",
            background: "#f0f4f8", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {v.images?.[0]?.image ? (
              <img src={v.images[0].image} alt={v.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <i className={`fa ${typeIcons[v.type] || "fa-car"}`}
                style={{ fontSize: "16px", color: "#1b6ca8", opacity: 0.4 }} />
            )}
          </div>
          <span style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "13px" }}>
            {v.name}
          </span>
        </div>
      ),
      type: (
        <span style={{
          background: "#e8f0fb", color: "#1b6ca8",
          borderRadius: "20px", padding: "3px 10px",
          fontSize: "11px", fontWeight: 700,
          display: "inline-flex", alignItems: "center", gap: "4px",
        }}>
          <i className={`fa ${typeIcons[v.type] || "fa-car"}`} style={{ fontSize: "10px" }} />
          {v.type}
        </span>
      ),
      price: (
        <span style={{ fontWeight: 700, color: "#0d7377", fontSize: "14px" }}>
          LKR {v.pricePerDay?.toLocaleString()}
        </span>
      ),
      seats: (
        <span style={{ color: "#555" }}>
          <i className="fa fa-users" style={{ marginRight: "4px", color: "#1b6ca8", fontSize: "11px" }} />
          {v.seats}
        </span>
      ),
      location: (
        <span style={{ color: "#555", fontSize: "13px" }}>
          <i className="fa fa-map-marker" style={{ marginRight: "4px", color: "#1b6ca8", fontSize: "11px" }} />
          {v.location}
        </span>
      ),
      status: (
        <span style={{
          background: v.available ? "#e0f5f0" : "#fdecea",
          color: v.available ? "#0d7377" : "#e74c3c",
          borderRadius: "20px", padding: "4px 12px",
          fontSize: "11px", fontWeight: 700,
          display: "inline-flex", alignItems: "center", gap: "4px",
        }}>
          <i className={`fa fa-${v.available ? "check-circle" : "times-circle"}`} style={{ fontSize: "10px" }} />
          {v.available ? "Available" : "Unavailable"}
        </span>
      ),
      actions: (
        <div style={{ display: "flex", gap: "6px" }}>
          <Link
            to={`/admin/vehicle/${v._id}`}
            title="Edit Vehicle"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #1b6ca8, #0d7377)",
              color: "#fff", textDecoration: "none",
            }}
          >
            <i className="fa fa-pencil" style={{ fontSize: "13px" }} />
          </Link>
          <button
            onClick={() => deleteHandler(v._id)}
            title="Delete Vehicle"
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
    })),
  });

  return (
    <>
      <MetaData title="Vehicle List — Admin" />
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
              <span style={{ color: "#1b6ca8", fontWeight: 600 }}>All Vehicles</span>
            </div>

            <Link
              to="/admin/vehicle/new"
              style={{
                background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                color: "#fff", textDecoration: "none",
                padding: "7px 16px", borderRadius: "8px",
                fontSize: "13px", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <i className="fa fa-plus" /> Add Vehicle
            </Link>
          </div>

          {/* Content */}
          <div style={{ padding: "1.5rem 1.8rem", flex: 1 }}>
            <div style={{
              background: "#fff", borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              {/* Card Header */}
              <div style={{
                background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                padding: "1rem 1.5rem",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className="fa fa-car" style={{ color: "#5ce1e6", fontSize: "16px" }} />
                  </div>
                  <div>
                    <h5 style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: "15px" }}>
                      Vehicle Fleet
                    </h5>
                    <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "12px" }}>
                      {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} total
                    </p>
                  </div>
                </div>

                {/* Summary pills */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { label: "Available",   value: vehicles.filter(v => v.available).length,  bg: "rgba(224,245,240,0.9)", color: "#0d7377" },
                    { label: "Unavailable", value: vehicles.filter(v => !v.available).length, bg: "rgba(253,236,234,0.9)", color: "#e74c3c" },
                  ].map(({ label, value, bg, color }) => (
                    <span key={label} style={{
                      background: bg, color,
                      borderRadius: "6px", padding: "4px 10px",
                      fontSize: "11px", fontWeight: 700,
                    }}>
                      {label}: {value}
                    </span>
                  ))}
                </div>
              </div>

              {loading ? <Loader /> : (
                <MDBDataTable
                  data={setVehicles()}
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