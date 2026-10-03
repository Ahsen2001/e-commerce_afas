import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchItineraryById, updateItinerary,
  addDay, deleteDay,
  addDestination, updateDestination, deleteDestination,
  reorderDestinations,
} from '../../actions/itineraryActions';
import { clearItineraryError, clearCurrentItinerary } from '../../slices/itinerarySlice';

const emptyDestForm = {
  name: '', description: '', category: 'sightseeing',
  startTime: '', endTime: '', notes: '',
};

const categoryColors = {
  sightseeing:   { bg: "#e8f0fb", color: "#1b6ca8"  },
  food:          { bg: "#fff4e0", color: "#b07800"  },
  accommodation: { bg: "#f3e8fb", color: "#8e44ad"  },
  activity:      { bg: "#e0f5f0", color: "#0d7377"  },
  transport:     { bg: "#fdecea", color: "#e74c3c"  },
  other:         { bg: "#f0f0f0", color: "#888"     },
};

const categoryIcons = {
  sightseeing:   "fa-camera",
  food:          "fa-cutlery",
  accommodation: "fa-bed",
  activity:      "fa-bicycle",
  transport:     "fa-car",
  other:         "fa-circle-o",
};

export default function ItineraryDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentItinerary: itinerary, loading, error } = useSelector((s) => s.itinerary);

  const [newDayDate, setNewDayDate] = useState('');
  const [destForms, setDestForms] = useState({});
  const [editingDest, setEditingDest] = useState(null);
  const [dragInfo, setDragInfo] = useState(null);

  useEffect(() => {
    dispatch(fetchItineraryById(id));
    return () => { dispatch(clearCurrentItinerary()); dispatch(clearItineraryError()); };
  }, [dispatch, id]);

  const handleStatusChange = (status) =>
    dispatch(updateItinerary({ id, data: { status } }));

  const handleAddDay = (e) => {
    e.preventDefault();
    dispatch(addDay({ itineraryId: id, data: { date: newDayDate || undefined } }));
    setNewDayDate('');
  };

  const handleDeleteDay = (dayId) => {
    if (!window.confirm('Remove this day and all its destinations?')) return;
    dispatch(deleteDay({ itineraryId: id, dayId }));
  };

  const toggleDestForm = (dayId) => {
    setDestForms((prev) => ({
      ...prev,
      [dayId]: { visible: !prev[dayId]?.visible, formData: prev[dayId]?.formData || emptyDestForm },
    }));
  };

  const handleDestFormChange = (dayId, field, value) => {
    setDestForms((prev) => ({
      ...prev,
      [dayId]: { ...prev[dayId], formData: { ...prev[dayId].formData, [field]: value } },
    }));
  };

  const handleAddDestination = async (e, dayId) => {
    e.preventDefault();
    const formData = destForms[dayId]?.formData;
    if (!formData?.name?.trim()) return;
    const result = await dispatch(addDestination({ itineraryId: id, dayId, data: formData }));
    if (addDestination.fulfilled.match(result)) {
      setDestForms((prev) => ({ ...prev, [dayId]: { visible: false, formData: emptyDestForm } }));
    }
  };

  const startEditDestination = (dayId, dest) => {
    setEditingDest({
      dayId, destinationId: dest._id,
      formData: {
        name: dest.name, description: dest.description || '',
        category: dest.category, startTime: dest.startTime || '',
        endTime: dest.endTime || '', notes: dest.notes || '',
      },
    });
  };

  const handleEditFormChange = (field, value) =>
    setEditingDest((prev) => ({ ...prev, formData: { ...prev.formData, [field]: value } }));

  const handleSaveEditDestination = async (e) => {
    e.preventDefault();
    const { dayId, destinationId, formData } = editingDest;
    const result = await dispatch(updateDestination({ itineraryId: id, dayId, destinationId, data: formData }));
    if (updateDestination.fulfilled.match(result)) setEditingDest(null);
  };

  const handleDeleteDestination = (dayId, destinationId) => {
    if (!window.confirm('Remove this destination?')) return;
    dispatch(deleteDestination({ itineraryId: id, dayId, destinationId }));
  };

  const handleDragStart = (dayId, index) => setDragInfo({ dayId, index });
  const handleDragOver  = (e) => e.preventDefault();
  const handleDrop = (dayId, dropIndex) => {
    if (!dragInfo || dragInfo.dayId !== dayId || dragInfo.index === dropIndex) { setDragInfo(null); return; }
    const day = itinerary.days.find((d) => d._id === dayId);
    const destinations = [...day.destinations].sort((a, b) => a.order - b.order);
    const [moved] = destinations.splice(dragInfo.index, 1);
    destinations.splice(dropIndex, 0, moved);
    setDragInfo(null);
    dispatch(reorderDestinations({ itineraryId: id, dayId, orderedDestinationIds: destinations.map((d) => d._id) }));
  };

  const labelStyle = {
    fontSize: "11px", fontWeight: 700, color: "#888",
    textTransform: "uppercase", letterSpacing: "0.8px",
    marginBottom: "5px", display: "block",
  };

  const inputStyle = {
    width: "100%", borderRadius: "8px",
    border: "1.5px solid #e0e0e0", padding: "9px 13px",
    fontSize: "13px", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
    fontFamily: "inherit", background: "#fff",
  };

  const statusColors = {
    draft:     { bg: "#f0f0f0",   color: "#888"    },
    planned:   { bg: "#e0f5f0",   color: "#0d7377" },
    completed: { bg: "#e8f0fb",   color: "#1b6ca8" },
    archived:  { bg: "#fff4e0",   color: "#b07800" },
  };

  if (loading && !itinerary) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem", gap: "12px" }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        border: "4px solid rgba(27,108,168,0.15)",
        borderTop: "4px solid #1b6ca8", borderRight: "4px solid #0d7377",
        animation: "spin 0.9s linear infinite",
      }} />
      <p style={{ color: "#888", fontSize: "13px" }}>Loading itinerary...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error && !itinerary) return (
    <div style={{ background: "#fdecea", color: "#e74c3c", border: "1px solid #fcd0ce", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>
      <i className="fa fa-exclamation-circle" style={{ marginRight: "6px" }} />{error}
    </div>
  );

  if (!itinerary) return null;

  const sc = statusColors[itinerary.status] || statusColors.draft;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>

      {/* ── Back button ── */}
      <button
        onClick={() => navigate('/itineraries')}
        style={{
          background: "none", border: "none", color: "#1b6ca8",
          cursor: "pointer", padding: "0", marginBottom: "14px",
          fontSize: "13px", fontWeight: 600, fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: "5px",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#0d7377"}
        onMouseLeave={e => e.currentTarget.style.color = "#1b6ca8"}
      >
        <i className="fa fa-arrow-left" /> Back to Itineraries
      </button>

      {/* ── Page Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
        borderRadius: "14px", padding: "1.2rem 1.8rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px",
        boxShadow: "0 4px 16px rgba(15,76,117,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "10px",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="fa fa-calendar" style={{ color: "#5ce1e6", fontSize: "20px" }} />
          </div>
          <div>
            <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>{itinerary.title}</h4>
            {itinerary.description && (
              <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
                {itinerary.description}
              </p>
            )}
          </div>
        </div>

        {/* Status selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            background: sc.bg, color: sc.color,
            borderRadius: "20px", padding: "4px 12px",
            fontSize: "11px", fontWeight: 800, textTransform: "uppercase",
          }}>
            {itinerary.status}
          </span>
          <select
            value={itinerary.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{
              padding: "7px 12px", borderRadius: "8px",
              border: "1.5px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.12)",
              color: "#fff", fontSize: "13px", fontWeight: 600,
              outline: "none", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <option value="draft"     style={{ color: "#1a1a1a", background: "#fff" }}>Draft</option>
            <option value="planned"   style={{ color: "#1a1a1a", background: "#fff" }}>Planned</option>
            <option value="completed" style={{ color: "#1a1a1a", background: "#fff" }}>Completed</option>
            <option value="archived"  style={{ color: "#1a1a1a", background: "#fff" }}>Archived</option>
          </select>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: "#fdecea", color: "#e74c3c",
          border: "1px solid #fcd0ce", borderRadius: "10px",
          padding: "10px 16px", marginBottom: "16px",
          fontSize: "13px", fontWeight: 600,
        }}>
          <i className="fa fa-exclamation-circle" style={{ marginRight: "6px" }} />{error}
        </div>
      )}

      {/* ── Add Day Form ── */}
      <div style={{
        background: "#fff", borderRadius: "12px",
        border: "1.5px dashed #d0e4f7", padding: "1rem 1.4rem",
        display: "flex", alignItems: "flex-end", gap: "12px",
        flexWrap: "wrap", marginBottom: "1.5rem",
      
      }}>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <label style={labelStyle}>
            <i className="fa fa-calendar-plus-o" style={{ marginRight: "5px", color: "#1b6ca8" }} />
            Date (optional)
          </label>
          <input
            type="date" value={newDayDate}
            onChange={(e) => setNewDayDate(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1b6ca8"}
            onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>
        <button
          onClick={handleAddDay}
          style={{
            background: "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
            color: "#fff", border: "none",
            padding: "10px 20px", borderRadius: "8px",
            fontSize: "13px", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <i className="fa fa-plus" /> Add Day
        </button>
      </div>

      {/* ── Empty days ── */}
      {itinerary.days.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <i className="fa fa-sun-o" style={{ fontSize: "40px", color: "#ddd", display: "block", marginBottom: "0.8rem" }} />
          <p style={{ color: "#888", fontSize: "13px" }}>No days added yet. Click "Add Day" to start planning!</p>
        </div>
      )}

      {/* ── Day Cards ── */}
      {itinerary.days.map((day) => (
        <div
          key={day._id}
          style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee", borderLeft: "4px solid #1b6ca8",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            marginBottom: "16px", overflow: "hidden",
          }}
        >
          {/* Day header */}
          <div style={{
            padding: "1rem 1.4rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "10px",
            borderBottom: "1px solid #f0f0f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "13px", fontWeight: 800, flexShrink: 0,
              }}>
                {day.dayNumber}
              </div>
              <div>
                <h6 style={{ margin: 0, fontWeight: 700, color: "#1b6ca8", fontSize: "15px" }}>
                  Day {day.dayNumber}
                </h6>
                {day.date && (
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    <i className="fa fa-calendar" style={{ marginRight: "4px" }} />
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => toggleDestForm(day._id)}
                style={{
                  background: destForms[day._id]?.visible ? "#f0f0f0" : "#f0f7ff",
                  color: destForms[day._id]?.visible ? "#555" : "#1b6ca8",
                  border: "1px solid",
                  borderColor: destForms[day._id]?.visible ? "#e0e0e0" : "#d0e4f7",
                  padding: "7px 14px", borderRadius: "8px",
                  fontSize: "12px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                <i className={`fa fa-${destForms[day._id]?.visible ? "times" : "plus"}`} />
                {destForms[day._id]?.visible ? "Cancel" : "Add Destination"}
              </button>
              <button
                onClick={() => handleDeleteDay(day._id)}
                style={{
                  background: "#fdecea", color: "#e74c3c",
                  border: "1px solid #fcd0ce",
                  padding: "7px 12px", borderRadius: "8px",
                  fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                <i className="fa fa-trash" /> Remove Day
              </button>
            </div>
          </div>

          {/* Add destination form */}
          {destForms[day._id]?.visible && (
            <div style={{ padding: "1.2rem", background: "#f8fbff", borderBottom: "1px solid #f0f0f0" }}>
              <form onSubmit={(e) => handleAddDestination(e, day._id)}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Name *</label>
                    <input
                      value={destForms[day._id].formData.name} required
                      onChange={(e) => handleDestFormChange(day._id, 'name', e.target.value)}
                      placeholder="e.g. Galle Fort"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Description</label>
                    <input
                      value={destForms[day._id].formData.description}
                      onChange={(e) => handleDestFormChange(day._id, 'description', e.target.value)}
                      placeholder="Optional description"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={destForms[day._id].formData.category}
                      onChange={(e) => handleDestFormChange(day._id, 'category', e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      {Object.keys(categoryColors).map((cat) => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Notes</label>
                    <input
                      value={destForms[day._id].formData.notes}
                      onChange={(e) => handleDestFormChange(day._id, 'notes', e.target.value)}
                      placeholder="Any notes..."
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                      onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Start Time</label>
                    <input
                      type="time" value={destForms[day._id].formData.startTime}
                      onChange={(e) => handleDestFormChange(day._id, 'startTime', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>End Time</label>
                    <input
                      type="time" value={destForms[day._id].formData.endTime}
                      onChange={(e) => handleDestFormChange(day._id, 'endTime', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)",
                    color: "#fff", border: "none",
                    padding: "9px 20px", borderRadius: "8px",
                    fontSize: "13px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}
                >
                  <i className="fa fa-map-marker" /> Add Destination
                </button>
              </form>
            </div>
          )}

          {/* Destinations list */}
          <div style={{ padding: "1rem 1.4rem" }}>
            {day.destinations.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: "12px", fontStyle: "italic", margin: 0 }}>
                <i className="fa fa-map-marker" style={{ marginRight: "5px" }} />
                No destinations added to this day yet.
              </p>
            ) : (
              day.destinations
                .slice().sort((a, b) => a.order - b.order)
                .map((dest, index) => {
                  const cc = categoryColors[dest.category] || categoryColors.other;
                  const ci = categoryIcons[dest.category]  || "fa-circle-o";
                  return (
                    <div
                      key={dest._id}
                      draggable
                      onDragStart={() => handleDragStart(day._id, index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(day._id, index)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "10px",
                        padding: "12px 14px", borderRadius: "10px",
                        border: "1.5px solid #eee", marginBottom: "8px",
                        background: "#fafcfc", cursor: "grab",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#d0e4f7"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,108,168,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee";    e.currentTarget.style.boxShadow = "none"; }}
                    >
                      {/* Drag handle */}
                      <span style={{ color: "#ccc", fontSize: "16px", paddingTop: "2px", userSelect: "none", cursor: "grab" }}>⠿</span>

                      {editingDest?.destinationId === dest._id ? (
                        /* Edit form */
                        <form onSubmit={handleSaveEditDestination} style={{ flex: 1 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                            <div style={{ gridColumn: "1 / -1" }}>
                              <input
                                value={editingDest.formData.name} required
                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                                onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                              />
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                              <input
                                value={editingDest.formData.description}
                                onChange={(e) => handleEditFormChange('description', e.target.value)}
                                placeholder="Description"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                                onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                              />
                            </div>
                            <div>
                              <input
                                type="time" value={editingDest.formData.startTime}
                                onChange={(e) => handleEditFormChange('startTime', e.target.value)}
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <input
                                type="time" value={editingDest.formData.endTime}
                                onChange={(e) => handleEditFormChange('endTime', e.target.value)}
                                style={inputStyle}
                              />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="submit"
                              style={{
                                background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                                color: "#fff", border: "none",
                                padding: "7px 16px", borderRadius: "8px",
                                fontSize: "12px", fontWeight: 700,
                                cursor: "pointer", fontFamily: "inherit",
                                display: "flex", alignItems: "center", gap: "5px",
                              }}
                            >
                              <i className="fa fa-check" /> Save
                            </button>
                            <button
                              type="button" onClick={() => setEditingDest(null)}
                              style={{
                                background: "#f0f0f0", color: "#555",
                                border: "none", padding: "7px 14px",
                                borderRadius: "8px", fontSize: "12px",
                                fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Destination view */
                        <>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px", flexWrap: "wrap" }}>
                              <strong style={{ fontSize: "14px", color: "#1a1a1a" }}>{dest.name}</strong>
                              <span style={{
                                background: cc.bg, color: cc.color,
                                borderRadius: "20px", padding: "2px 9px",
                                fontSize: "10px", fontWeight: 700,
                                display: "inline-flex", alignItems: "center", gap: "3px",
                              }}>
                                <i className={`fa ${ci}`} style={{ fontSize: "9px" }} />
                                {dest.category}
                              </span>
                            </div>
                            {(dest.startTime || dest.endTime) && (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: "4px",
                                background: "#f0f7ff", color: "#1b6ca8",
                                borderRadius: "6px", padding: "2px 8px",
                                fontSize: "11px", fontWeight: 700, marginBottom: "4px",
                              }}>
                                <i className="fa fa-clock-o" style={{ fontSize: "10px" }} />
                                {dest.startTime || "—"} → {dest.endTime || "—"}
                              </span>
                            )}
                            {dest.description && (
                              <p style={{ margin: "3px 0 0", color: "#555", fontSize: "12px", lineHeight: 1.5 }}>
                                {dest.description}
                              </p>
                            )}
                            {dest.notes && (
                              <p style={{
                                margin: "5px 0 0", color: "#888", fontSize: "11px",
                                background: "#f8f9fa", borderRadius: "6px",
                                padding: "4px 8px", borderLeft: "3px solid #d0e4f7",
                              }}>
                                <i className="fa fa-sticky-note-o" style={{ marginRight: "4px", color: "#1b6ca8" }} />
                                {dest.notes}
                              </p>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                            <button
                              onClick={() => startEditDestination(day._id, dest)}
                              style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "30px", height: "30px", borderRadius: "8px",
                                background: "#f0f7ff", border: "1px solid #d0e4f7",
                                color: "#1b6ca8", cursor: "pointer",
                              }}
                              title="Edit"
                            >
                              <i className="fa fa-pencil" style={{ fontSize: "12px" }} />
                            </button>
                            <button
                              onClick={() => handleDeleteDestination(day._id, dest._id)}
                              style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "30px", height: "30px", borderRadius: "8px",
                                background: "#fdecea", border: "1px solid #fcd0ce",
                                color: "#e74c3c", cursor: "pointer",
                              }}
                              title="Remove"
                            >
                              <i className="fa fa-trash" style={{ fontSize: "12px" }} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}