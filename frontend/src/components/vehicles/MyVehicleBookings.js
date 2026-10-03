import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyBookings } from "../../actions/vehicleActions";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";

const statusColors = {
  Pending:   { bg: "#fff4e0", color: "#b07800" },
  Confirmed: { bg: "#e0f5f0", color: "#0d7377" },
  Cancelled: { bg: "#fdecea", color: "#e74c3c" },
  Completed: { bg: "#e8f0fb", color: "#1b6ca8" },
};

export default function MyVehicleBookings() {
  const dispatch = useDispatch();
  const { bookings = [], loading } = useSelector((s) => s.vehicle || {});

  useEffect(() => { dispatch(getMyBookings()); }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="My Vehicle Bookings — TravelVista.LK" />

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
          <i className="fa fa-car" style={{ color: "#5ce1e6", fontSize: "20px" }} />
        </div>
        <div>
          <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>My Vehicle Bookings</h4>
          <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Empty */}
      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem" }}>
          <i className="fa fa-car" style={{ fontSize: "52px", color: "#ddd", display: "block", marginBottom: "1rem" }} />
          <h5 style={{ color: "#888" }}>No bookings yet</h5>
          <p style={{ color: "#aaa", fontSize: "13px" }}>Browse vehicles and make your first booking!</p>
        </div>
      ) : (
        bookings.map((booking) => {
          const sc = statusColors[booking.status] || statusColors.Pending;
          return (
            <div
              key={booking._id}
              style={{
                background: "#fff", borderRadius: "12px",
                border: "1px solid #eee", marginBottom: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden",
              }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "1rem 1.2rem", flexWrap: "wrap",
              }}>
                {/* Image */}
                <div style={{
                  width: "80px", height: "65px", borderRadius: "8px",
                  overflow: "hidden", flexShrink: 0,
                  background: "#f0f4f8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {booking.vehicle?.images?.[0]?.image ? (
                    <img src={booking.vehicle.images[0].image} alt={booking.vehicle.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="fa fa-car" style={{ fontSize: "28px", color: "#1b6ca8", opacity: 0.3 }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <h6 style={{ margin: 0, fontWeight: 700, color: "#1a1a1a", fontSize: "15px" }}>
                    {booking.vehicle?.name}
                  </h6>
                  <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#aaa" }}>
                    <i className="fa fa-map-marker" style={{ marginRight: "4px", color: "#1b6ca8" }} />
                    {booking.pickupLocation}
                  </p>
                </div>

                {/* Dates */}
                <div style={{ textAlign: "center", minWidth: "160px" }}>
                  <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Duration
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#222", marginTop: "2px" }}>
                    {new Date(booking.pickupDate).toLocaleDateString()} →{" "}
                    {new Date(booking.returnDate).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {booking.totalDays} day{booking.totalDays > 1 ? "s" : ""}
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: "right", minWidth: "120px" }}>
                  <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600 }}>Total</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#0d7377" }}>
                    LKR {booking.totalPrice?.toLocaleString()}
                  </div>
                </div>

                {/* Status */}
                <span style={{
                  background: sc.bg, color: sc.color,
                  borderRadius: "20px", padding: "5px 14px",
                  fontSize: "12px", fontWeight: 700, flexShrink: 0,
                }}>
                  {booking.status}
                </span>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}