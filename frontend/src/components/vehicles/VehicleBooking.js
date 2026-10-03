import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getVehicle, bookVehicle } from "../../actions/vehicleActions";
import { clearBookVehicle, clearError } from "../../slices/vehicleSlice";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";

const typeIcons = {
  Car: "fa-car", Van: "fa-bus", Bike: "fa-motorcycle",
  Bus: "fa-bus", SUV: "fa-truck", "Tuk-Tuk": "fa-taxi",
};

export default function VehicleBooking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { vehicle, loading, isBooked, error } = useSelector((s) => s.vehicle || {});
  const { isAuthenticated } = useSelector((s) => s.auth || {});

  const today = new Date().toISOString().split("T")[0];
  const [pickupDate,     setPickupDate]     = useState("");
  const [returnDate,     setReturnDate]     = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  useEffect(() => { dispatch(getVehicle(id)); }, [dispatch, id]);

  useEffect(() => {
    if (isBooked) {
      toast.success("Vehicle booked successfully!", { position: "bottom-center" });
      dispatch(clearBookVehicle());
      navigate("/my/vehicle/bookings");
    }
    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
    }
  }, [isBooked, error, dispatch, navigate]);

  const totalDays = pickupDate && returnDate
    ? Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = totalDays > 0 ? totalDays * (vehicle?.pricePerDay || 0) : 0;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (totalDays <= 0) { toast.error("Return date must be after pickup date"); return; }
    dispatch(bookVehicle(id, { pickupDate, returnDate, pickupLocation }));
  };

  const labelStyle = {
    fontSize: "11px", fontWeight: 700, color: "#888",
    textTransform: "uppercase", letterSpacing: "0.8px",
    marginBottom: "6px", display: "block",
  };

  const inputStyle = {
    width: "100%", borderRadius: "8px",
    border: "1.5px solid #e0e0e0", padding: "10px 14px",
    fontSize: "14px", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  if (loading) return <Loader />;
  if (!vehicle) return <p style={{ color: "#888", textAlign: "center", padding: "4rem" }}>Vehicle not found.</p>;

  return (
    <>
      <MetaData title={`Book ${vehicle.name} — TravelVista.LK`} />

      {/* Back */}
      <button
        onClick={() => navigate("/vehicles")}
        style={{
          background: "none", border: "none", color: "#1b6ca8",
          cursor: "pointer", fontSize: "13px", fontWeight: 600,
          display: "flex", alignItems: "center", gap: "5px",
          marginBottom: "16px", fontFamily: "inherit",
        }}
      >
        <i className="fa fa-arrow-left" /> Back to Vehicles
      </button>

      <div className="row" style={{ gap: 0 }}>

        {/* ── Vehicle Info ── */}
        <div className="col-12 col-md-5" style={{ marginBottom: "1.5rem" }}>
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee", overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            {vehicle.images?.[0]?.image ? (
              <img src={vehicle.images[0].image} alt={vehicle.name}
                style={{ width: "100%", height: "220px", objectFit: "cover" }} />
            ) : (
              <div style={{
                height: "220px", background: "#f0f4f8",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i className={`fa ${typeIcons[vehicle.type] || "fa-car"}`}
                  style={{ fontSize: "60px", color: "#1b6ca8", opacity: 0.2 }} />
              </div>
            )}

            <div style={{ padding: "1.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <h5 style={{ margin: 0, fontWeight: 800, color: "#1a1a1a" }}>{vehicle.name}</h5>
                <span style={{
                  background: vehicle.available ? "#e0f5f0" : "#fdecea",
                  color: vehicle.available ? "#0d7377" : "#e74c3c",
                  borderRadius: "20px", padding: "4px 12px",
                  fontSize: "11px", fontWeight: 700,
                }}>
                  {vehicle.available ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Specs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                {[
                  { icon: "fa-car",   val: vehicle.type         },
                  { icon: "fa-users", val: `${vehicle.seats} Seats` },
                  { icon: "fa-tint",  val: vehicle.fuelType     },
                  { icon: "fa-cog",   val: vehicle.transmission },
                ].map(({ icon, val }) => (
                  <span key={val} style={{
                    background: "#f0f7ff", color: "#1b6ca8",
                    borderRadius: "6px", padding: "4px 10px",
                    fontSize: "11px", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: "4px",
                  }}>
                    <i className={`fa ${icon}`} style={{ fontSize: "10px" }} />
                    {val}
                  </span>
                ))}
              </div>

              {vehicle.description && (
                <p style={{ margin: "0 0 12px", color: "#666", fontSize: "13px", lineHeight: 1.6 }}>
                  {vehicle.description}
                </p>
              )}

              <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
                <i className="fa fa-map-marker" style={{ marginRight: "4px", color: "#1b6ca8" }} />
                {vehicle.location}
              </p>

              <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f0f0f0" }}>
                <span style={{
                  fontSize: "26px", fontWeight: 800,
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  LKR {vehicle.pricePerDay?.toLocaleString()}
                </span>
                <span style={{ fontSize: "13px", color: "#aaa", marginLeft: "5px" }}>/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Booking Form ── */}
        <div className="col-12 col-md-7" style={{ paddingLeft: "1.5rem" }}>
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee", overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            {/* Card header */}
            <div style={{
              background: "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
              padding: "1rem 1.5rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <i className="fa fa-calendar" style={{ color: "#5ce1e6", fontSize: "16px" }} />
              <h5 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Book This Vehicle</h5>
            </div>

            <form onSubmit={submitHandler} style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>
                  <i className="fa fa-calendar" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                  Pickup Date
                </label>
                <input
                  type="date" min={today} value={pickupDate} required
                  onChange={(e) => setPickupDate(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                  onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>
                  <i className="fa fa-calendar-check-o" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                  Return Date
                </label>
                <input
                  type="date" min={pickupDate || today} value={returnDate} required
                  onChange={(e) => setReturnDate(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                  onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>
                  <i className="fa fa-map-marker" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                  Pickup Location
                </label>
                <input
                  type="text" required
                  placeholder="e.g. Colombo Fort, Kandy Town"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                  onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Summary */}
              {totalDays > 0 && (
                <div style={{
                  background: "#f0f7ff", borderRadius: "10px",
                  padding: "12px 16px", marginBottom: "1.2rem",
                  border: "1px solid #d0e4f7",
                }}>
                  {[
                    { label: "Duration", val: `${totalDays} day${totalDays > 1 ? "s" : ""}` },
                    { label: "Rate",     val: `LKR ${vehicle.pricePerDay?.toLocaleString()}/day` },
                  ].map(({ label, val }) => (
                    <div key={label} style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: "13px", color: "#555", marginBottom: "5px",
                    }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    borderTop: "1px solid #d0e4f7", paddingTop: "8px", marginTop: "4px",
                  }}>
                    <span style={{ fontWeight: 700, color: "#1b6ca8" }}>Total</span>
                    <span style={{ fontWeight: 800, color: "#0d7377", fontSize: "16px" }}>
                      LKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!vehicle.available || loading}
                style={{
                  width: "100%",
                  background: vehicle.available
                    ? "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)"
                    : "#ccc",
                  color: "#fff", border: "none",
                  padding: "13px", borderRadius: "10px",
                  fontSize: "15px", fontWeight: 700,
                  cursor: vehicle.available ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  fontFamily: "inherit",
                }}
              >
                <i className={`fa ${loading ? "fa-spinner fa-spin" : "fa-check-circle"}`} />
                {loading ? "Processing..." : isAuthenticated ? "Confirm Booking" : "Login to Book"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}