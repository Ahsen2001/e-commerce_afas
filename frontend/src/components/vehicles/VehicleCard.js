import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/imageUrl";

export default function VehicleCard({ vehicle = {} }) {
  const typeIcons = {
    Car: "fa-car",
    Van: "fa-shuttle-van",
    Bike: "fa-motorcycle",
    Bus: "fa-bus",
    SUV: "fa-truck",
    "Tuk-Tuk": "fa-taxi",
  };

  const imageUrl = resolveImageUrl(vehicle.images?.[0]?.image);

  return (
    <div style={{
      background: "#fff",
      borderRadius: "14px",
      border: "1px solid #eee",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* IMAGE */}
      <div style={{ position: "relative", height: "170px" }}>
        {vehicle.images?.length > 0 ? (
          <img
            src={imageUrl}
            alt={vehicle.name || "Vehicle"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <i className={`fa ${typeIcons[vehicle.type] || "fa-car"}`}
              style={{ fontSize: "40px", opacity: 0.3 }} />
          </div>
        )}

        {/* TYPE */}
        <span style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "#0f4c75",
          color: "#fff",
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "11px"
        }}>
          {vehicle.type}
        </span>

        {/* STATUS */}
        <span style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: vehicle.available ? "green" : "red",
          color: "#fff",
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "11px"
        }}>
          {vehicle.available ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "12px" }}>
        <h5>{vehicle.name}</h5>

        <p style={{ fontSize: "12px", color: "#777" }}>
          {vehicle.location}
        </p>

        <div style={{ fontWeight: 700 }}>
          LKR {Number(vehicle.pricePerDay || 0).toLocaleString()} / day
        </div>

        <Link
          to={`/vehicle/${vehicle._id}`}
          style={{
            display: "block",
            marginTop: "10px",
            textAlign: "center",
            background: "#0f4c75",
            color: "#fff",
            padding: "8px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}