import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getVehicles } from "../../actions/vehicleActions";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";

const TYPES = ["All", "Car", "Van", "Bike", "Bus", "SUV", "Tuk-Tuk"];

const typeIcons = {
  Car: "fa-car", Van: "fa-bus", Bike: "fa-motorcycle",
  Bus: "fa-bus", SUV: "fa-truck", "Tuk-Tuk": "fa-taxi",
};

export default function VehicleList() {
  const dispatch = useDispatch();
  const { vehicles = [], loading } = useSelector((s) => s.vehicle || {});

  const [type,          setType]          = useState("");
  const [maxPrice,      setMaxPrice]      = useState(50000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    dispatch(getVehicles(
      type === "All" ? "" : type,
      maxPrice,
      onlyAvailable ? "true" : ""
    ));
  }, [dispatch, type, maxPrice, onlyAvailable]);

  return (
    <>
      <MetaData title="Vehicle Rentals — TravelVista.LK" />

      {/* ── Page Header ── */}
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
          <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Vehicle Rentals</h4>
          <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
            Explore Sri Lanka at your own pace
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{
        background: "#fff", borderRadius: "12px",
        border: "1px solid #eee", padding: "1rem 1.2rem",
        marginBottom: "1.5rem",
        display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        {/* Type pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {TYPES.map((t) => {
            const active = type === t || (t === "All" && type === "");
            return (
              <button
                key={t}
                onClick={() => setType(t === "All" ? "" : t)}
                style={{
                  padding: "5px 14px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  border: "1.5px solid",
                  borderColor: active ? "#1b6ca8" : "#e0e0e0",
                  background: active
                    ? "linear-gradient(135deg, #0f4c75, #0d7377)"
                    : "#fff",
                  color: active ? "#fff" : "#555",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Max price */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
          <span style={{ fontSize: "12px", color: "#888", fontWeight: 600 }}>Max/day:</span>
          <span style={{
            background: "#f0f7ff", color: "#1b6ca8",
            borderRadius: "6px", padding: "3px 10px",
            fontSize: "12px", fontWeight: 700,
          }}>
            LKR {maxPrice.toLocaleString()}
          </span>
          <input
            type="range" min={500} max={50000} step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: "100px" }}
          />
        </div>

        {/* Available toggle */}
        <label style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "13px", color: "#555", cursor: "pointer", fontWeight: 600,
        }}>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Available only
        </label>
      </div>

      {/* ── Grid ── */}
      {loading ? <Loader /> : (
        vehicles.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "18px",
          }}>
            {vehicles.map((v) => (
              <div
                key={v._id}
                style={{
                  background: "#fff", borderRadius: "14px",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: "170px", background: "#f0f4f8", overflow: "hidden" }}>
                  {v.images?.[0]?.image ? (
                    <img src={v.images[0].image} alt={v.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className={`fa ${typeIcons[v.type] || "fa-car"}`}
                        style={{ fontSize: "48px", color: "#1b6ca8", opacity: 0.2 }} />
                    </div>
                  )}
                  <span style={{
                    position: "absolute", top: "10px", left: "10px",
                    background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                    color: "#fff", borderRadius: "20px",
                    padding: "3px 10px", fontSize: "11px", fontWeight: 700,
                  }}>
                    <i className={`fa ${typeIcons[v.type] || "fa-car"}`} style={{ marginRight: "4px" }} />
                    {v.type}
                  </span>
                  <span style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: v.available ? "rgba(13,115,119,0.9)" : "rgba(231,76,60,0.9)",
                    color: "#fff", borderRadius: "20px",
                    padding: "3px 10px", fontSize: "11px", fontWeight: 700,
                  }}>
                    {v.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <h6 style={{ margin: 0, fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}>
                    {v.name}
                  </h6>

                  {/* Specs */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { icon: "fa-users", val: `${v.seats} Seats`  },
                      { icon: "fa-tint",  val: v.fuelType           },
                      { icon: "fa-cog",   val: v.transmission       },
                    ].map(({ icon, val }) => (
                      <span key={val} style={{
                        background: "#f0f7ff", color: "#1b6ca8",
                        borderRadius: "6px", padding: "3px 8px",
                        fontSize: "11px", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: "4px",
                      }}>
                        <i className={`fa ${icon}`} style={{ fontSize: "10px" }} />
                        {val}
                      </span>
                    ))}
                  </div>

                  {/* Location */}
                  <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
                    <i className="fa fa-map-marker" style={{ marginRight: "4px", color: "#1b6ca8" }} />
                    {v.location}
                  </p>

                  {/* Price + button */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginTop: "auto", paddingTop: "8px",
                  }}>
                    <div>
                      <span style={{
                        fontSize: "18px", fontWeight: 800,
                        background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      }}>
                        LKR {v.pricePerDay?.toLocaleString()}
                      </span>
                      <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "3px" }}>/day</span>
                    </div>
                    <Link
                      to={`/vehicle/${v._id}`}
                      style={{
                        background: "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
                        color: "#fff", textDecoration: "none",
                        padding: "7px 14px", borderRadius: "8px",
                        fontSize: "12px", fontWeight: 700,
                        display: "flex", alignItems: "center", gap: "5px",
                      }}
                    >
                      <i className="fa fa-calendar" /> Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "5rem" }}>
            <i className="fa fa-car" style={{ fontSize: "52px", color: "#ddd", display: "block", marginBottom: "1rem" }} />
            <h5 style={{ color: "#888" }}>No vehicles found</h5>
            <p style={{ color: "#aaa", fontSize: "13px" }}>Try changing your filters</p>
          </div>
        )
      )}
    </>
  );
}