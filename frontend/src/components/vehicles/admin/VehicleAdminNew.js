import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createVehicle } from "../../../actions/vehicleActions";
import { clearError, clearVehicleCreated } from "../../../slices/vehicleSlice";
import { toast } from "react-toastify";
import Sidebar from "../../admin/Sidebar";
import MetaData from "../../layouts/MetaData";

const TYPES         = ["Car", "Van", "Bike", "Bus", "SUV", "Tuk-Tuk"];
const FUEL_TYPES    = ["Petrol", "Diesel", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];

export default function VehicleAdminNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { loading, isVehicleCreated, error } = useSelector((s) => s.vehicle || {});

  const [name,         setName]         = useState("");
  const [type,         setType]         = useState("Car");
  const [description,  setDescription]  = useState("");
  const [pricePerDay,  setPricePerDay]  = useState("");
  const [seats,        setSeats]        = useState("");
  const [fuelType,     setFuelType]     = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [location,     setLocation]     = useState("");
  const [available,    setAvailable]    = useState(true);
  const [images,       setImages]       = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    if (isVehicleCreated) {
      toast.success("Vehicle created successfully!", { position: "bottom-center" });
      dispatch(clearVehicleCreated());
      navigate("/admin/vehicles");
    }
    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
    }
  }, [isVehicleCreated, error, dispatch, navigate]);

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagesPreview((old) => old.filter((_, i) => i !== index));
    setImages((old) => old.filter((_, i) => i !== index));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name",         name);
    formData.append("type",         type);
    formData.append("description",  description);
    formData.append("pricePerDay",  pricePerDay);
    formData.append("seats",        seats);
    formData.append("fuelType",     fuelType);
    formData.append("transmission", transmission);
    formData.append("location",     location);
    formData.append("available",    available);
    images.forEach((img) => formData.append("images", img));
    dispatch(createVehicle(formData));
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
    fontFamily: "inherit", background: "#fff",
  };

  return (
    <>
      <MetaData title="Add Vehicle — Admin" />
      <div style={{ display: "flex", minHeight: "100vh" }}>

        <div style={{ width: sidebarOpen ? "var(--admin-sidebar-width)" : "var(--admin-sidebar-collapsed-width)", flexShrink: 0, transition: "width 0.25s ease", overflow: "hidden" }}>
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
              <span style={{ color: "#1b6ca8", fontWeight: 600 }}>Add New</span>
            </div>

            <div style={{ width: "36px" }} />
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
                <i className="fa fa-plus-circle" style={{ color: "#5ce1e6", fontSize: "20px" }} />
              </div>
              <div>
                <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Add New Vehicle</h4>
                <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
                  Fill in the details to add a vehicle to the fleet
                </p>
              </div>
            </div>

            {/* Form Card */}
            <div style={{
              background: "#fff", borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <form onSubmit={submitHandler}>
                <div style={{ padding: "1.8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>

                  {/* Name */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-car" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Vehicle Name *
                    </label>
                    <input
                      type="text" value={name} required
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Toyota Aqua"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-tags" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Vehicle Type *
                    </label>
                    <select
                      value={type} required
                      onChange={(e) => setType(e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    >
                      {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-money" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Price Per Day (LKR) *
                    </label>
                    <input
                      type="number" value={pricePerDay} required min="0"
                      onChange={(e) => setPricePerDay(e.target.value)}
                      placeholder="e.g. 6500"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>

                  {/* Seats */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-users" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Number of Seats *
                    </label>
                    <input
                      type="number" value={seats} required min="1"
                      onChange={(e) => setSeats(e.target.value)}
                      placeholder="e.g. 4"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-tint" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Fuel Type
                    </label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    >
                      {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-cog" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Transmission
                    </label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    >
                      {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-map-marker" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Location
                    </label>
                    <input
                      type="text" value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Colombo"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label style={labelStyle}>
                      <i className="fa fa-check-circle" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Availability
                    </label>
                    <select
                      value={available}
                      onChange={(e) => setAvailable(e.target.value === "true")}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>

                  {/* Description — full width */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>
                      <i className="fa fa-align-left" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Description
                    </label>
                    <textarea
                      rows={3} value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the vehicle..."
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>

                  {/* Images — full width */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>
                      <i className="fa fa-image" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                      Vehicle Images
                    </label>

                    <label htmlFor="vehicle_images" style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: "8px",
                      border: "2px dashed #d0e4f7", borderRadius: "10px",
                      padding: "1.5rem", cursor: "pointer", background: "#f8fbff",
                      transition: "border-color 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#1b6ca8"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#d0e4f7"}
                    >
                      <i className="fa fa-cloud-upload" style={{ fontSize: "28px", color: "#1b6ca8", opacity: 0.6 }} />
                      <span style={{ color: "#888", fontSize: "13px", fontWeight: 600 }}>
                        Click to upload vehicle images
                      </span>
                      <span style={{ color: "#bbb", fontSize: "11px" }}>PNG, JPG — multiple allowed</span>
                      <input
                        type="file" id="vehicle_images"
                        multiple accept="image/*"
                        onChange={onImagesChange}
                        style={{ display: "none" }}
                      />
                    </label>

                    {imagesPreview.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" }}>
                        {imagesPreview.map((img, index) => (
                          <div key={index} style={{ position: "relative" }}>
                            <img
                              src={img} alt={`Preview ${index + 1}`}
                              style={{
                                width: "80px", height: "70px",
                                objectFit: "cover", borderRadius: "8px",
                                border: "1.5px solid #e0e0e0",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
                                position: "absolute", top: "-6px", right: "-6px",
                                width: "20px", height: "20px", borderRadius: "50%",
                                background: "#e74c3c", border: "none",
                                color: "#fff", fontSize: "10px", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}
                            >
                              <i className="fa fa-times" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  padding: "1.2rem 1.8rem",
                  borderTop: "1px solid #f0f0f0", background: "#f8f9fa",
                  display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px",
                }}>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/vehicles")}
                    style={{
                      background: "#fff", color: "#555",
                      border: "1.5px solid #e0e0e0", padding: "10px 24px",
                      borderRadius: "8px", fontSize: "14px", fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={loading}
                    style={{
                      background: loading ? "#ccc" : "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                      color: "#fff", border: "none",
                      padding: "10px 28px", borderRadius: "8px",
                      fontSize: "14px", fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: "8px",
                      fontFamily: "inherit",
                    }}
                  >
                    <i className={`fa ${loading ? "fa-spinner fa-spin" : "fa-plus-circle"}`} />
                    {loading ? "Creating..." : "Create Vehicle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}