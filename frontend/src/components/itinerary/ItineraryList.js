import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchItineraries,
  createItinerary,
  deleteItinerary,
} from "../../actions/itineraryActions";
import { clearItineraryError } from "../../slices/itinerarySlice";
import { toast } from "react-toastify";

export default function ItineraryList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itineraries, loading, error } = useSelector(
    (state) => state.itinerary,
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(fetchItineraries());
    return () => dispatch(clearItineraryError());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearItineraryError());
    }
  }, [error, dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();

    // Remove leading/trailing spaces
    if (!form.title.trim()) {
      toast.warning("Please enter itinerary title");
      return;
    }

    const result = await dispatch(
      createItinerary({
        ...form,
        title: form.title.trim(),
      }),
    );

    if (createItinerary.fulfilled.match(result)) {
      toast.success("Itinerary created successfully!");

      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });

      setShowForm(false);
    } else {
      toast.error(result.payload || "Failed to create itinerary");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this itinerary? This cannot be undone."))
      return;

    const result = await dispatch(deleteItinerary(id));

    if (deleteItinerary.fulfilled.match(result)) {
      toast.success("Itinerary deleted successfully!");
    } else {
      toast.error(result.payload || "Failed to delete itinerary");
    }
  };
  const statusColors = {
    draft: { bg: "#f0f0f0", color: "#888" },
    planned: { bg: "#e0f5f0", color: "#0d7377" },
    completed: { bg: "#e8f0fb", color: "#1b6ca8" },
    archived: { bg: "#fff4e0", color: "#b07800" },
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "6px",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "8px",
    border: "1.5px solid #e0e0e0",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "#fff",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      {/* ── Page Header ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
          borderRadius: "14px",
          padding: "1.2rem 1.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "0 4px 16px rgba(15,76,117,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="fa fa-map"
              style={{ color: "#5ce1e6", fontSize: "20px" }}
            />
          </div>
          <div>
            <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
              My Itineraries
            </h4>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                fontSize: "13px",
              }}
            >
              Plan your perfect Sri Lanka journey
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? "rgba(255,255,255,0.15)" : "#5ce1e6",
            color: showForm ? "#fff" : "#0f4c75",
            border: showForm ? "1px solid rgba(255,255,255,0.3)" : "none",
            borderRadius: "20px",
            padding: "9px 20px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <i className={`fa fa-${showForm ? "times" : "plus"}`} />
          {showForm ? "Cancel" : "New Itinerary"}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            background: "#fdecea",
            color: "#e74c3c",
            border: "1px solid #fcd0ce",
            borderRadius: "10px",
            padding: "10px 16px",
            marginBottom: "16px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <i
            className="fa fa-exclamation-circle"
            style={{ marginRight: "6px" }}
          />
          {error}
        </div>
      )}

      {/* ── Create Form ── */}
      {showForm && (
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            overflow: "hidden",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f4c75, #0d7377)",
              padding: "0.9rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i
              className="fa fa-plus-circle"
              style={{ color: "#5ce1e6", fontSize: "15px" }}
            />
            <h6 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
              Create New Itinerary
            </h6>
          </div>

          <form onSubmit={handleCreate} style={{ padding: "1.4rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  <i
                    className="fa fa-tag"
                    style={{ marginRight: "5px", color: "#1b6ca8" }}
                  />
                  Trip Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  required
                  onChange={handleChange}
                  placeholder="e.g. Southern Coast Adventure"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  <i
                    className="fa fa-align-left"
                    style={{ marginRight: "5px", color: "#1b6ca8" }}
                  />
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Optional trip summary..."
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  <i
                    className="fa fa-calendar"
                    style={{ marginRight: "5px", color: "#1b6ca8" }}
                  />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  <i
                    className="fa fa-calendar-check-o"
                    style={{ marginRight: "5px", color: "#1b6ca8" }}
                  />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#1b6ca8")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                paddingTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: "#fff",
                  color: "#555",
                  border: "1.5px solid #e0e0e0",
                  padding: "9px 20px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background:
                    "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
                  color: "#fff",
                  border: "none",
                  padding: "9px 22px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i className="fa fa-check" />
                Create Itinerary
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Loading ── */}
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "4rem",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "4px solid rgba(27,108,168,0.15)",
              borderTop: "4px solid #1b6ca8",
              borderRight: "4px solid #0d7377",
              animation: "spin 0.9s linear infinite",
            }}
          />
          <p style={{ color: "#888", fontSize: "13px" }}>
            Loading itineraries...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : itineraries.length === 0 ? (
        /* ── Empty state ── */
        <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e8f0fb, #e0f5f5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.2rem",
            }}
          >
            <i
              className="fa fa-map-o"
              style={{ fontSize: "32px", color: "#1b6ca8" }}
            />
          </div>
          <h5 style={{ fontWeight: 700, color: "#333", marginBottom: "6px" }}>
            No itineraries yet
          </h5>
          <p
            style={{ color: "#888", fontSize: "13px", marginBottom: "1.2rem" }}
          >
            Create your first trip plan and start exploring Sri Lanka!
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "linear-gradient(135deg, #0f4c75, #0d7377)",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <i className="fa fa-plus" />
            Create First Itinerary
          </button>
        </div>
      ) : (
        /* ── Grid ── */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {itineraries.map((it) => {
            const sc = statusColors[it.status] || statusColors.draft;
            const days = it.days?.length || 0;
            return (
              <div
                key={it._id}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.05)";
                }}
              >
                {/* Card color strip */}
                <div
                  style={{
                    height: "5px",
                    background:
                      "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
                  }}
                />

                <div
                  style={{
                    padding: "1.2rem",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {/* Title + badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <h6
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "15px",
                        color: "#1a1a1a",
                        lineHeight: 1.3,
                      }}
                    >
                      {it.title}
                    </h6>
                    <span
                      style={{
                        background: sc.bg,
                        color: sc.color,
                        borderRadius: "20px",
                        padding: "3px 10px",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      {it.status}
                    </span>
                  </div>

                  {/* Description */}
                  {it.description && (
                    <p
                      style={{
                        margin: 0,
                        color: "#888",
                        fontSize: "12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {it.description}
                    </p>
                  )}

                  {/* Dates */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    <i
                      className="fa fa-calendar"
                      style={{ color: "#1b6ca8", fontSize: "11px" }}
                    />
                    {it.startDate
                      ? new Date(it.startDate).toLocaleDateString()
                      : "No start"}
                    <span>—</span>
                    {it.endDate
                      ? new Date(it.endDate).toLocaleDateString()
                      : "No end"}
                  </div>

                  {/* Days count */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        background: "#f0f7ff",
                        color: "#1b6ca8",
                        borderRadius: "6px",
                        padding: "3px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i className="fa fa-sun-o" style={{ fontSize: "10px" }} />
                      {days} day{days !== 1 ? "s" : ""} planned
                    </span>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "auto",
                      paddingTop: "10px",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/itineraries/${it._id}`)}
                      style={{
                        flex: 1,
                        background:
                          "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
                        color: "#fff",
                        border: "none",
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <i className="fa fa-eye" />
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(it._id)}
                      style={{
                        background: "#fdecea",
                        color: "#e74c3c",
                        border: "1px solid #fcd0ce",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
