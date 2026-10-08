import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../actions/authActions";
import { clearError, clearUserUpdated } from "../../slices/userSlice";
import { toast } from "react-toastify";

export default function UpdateUser() {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState("");

  const { id: userId } = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { loading, isUserUpdated, error, user } = useSelector((state) => state.user || {});
  const { user: authUser } = useSelector((state) => state.auth || {});

  const isSelf = user?._id === authUser?._id;

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name",  name);
    formData.append("email", email);
    formData.append("role",  role);
    dispatch(updateUser(userId, formData));
  };

  useEffect(() => {
    if (isUserUpdated) {
      toast("User updated successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearUserUpdated()),
      });
      return;
    }
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }
    dispatch(getUser(userId));
  }, [dispatch, userId, isUserUpdated, error]);

  useEffect(() => {
  if (user?._id) {
    setName(user.name || "");
    setEmail(user.email || "");
    setRole(user.role || "user");
  }
}, [user]);

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
    background: "#fff", fontFamily: "inherit",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "var(--admin-sidebar-width)" : "var(--admin-sidebar-collapsed-width)",
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
            <span style={{ color: "#555" }}>Users</span>
            <span>/</span>
            <span style={{ color: "#1b6ca8", fontWeight: 600 }}>Update User</span>
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
              <i className="fa fa-user-circle" style={{ color: "#5ce1e6", fontSize: "20px" }} />
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>Update User</h4>
              <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
                {user?.name || "Edit user details"}
              </p>
            </div>

            {/* User avatar preview */}
            {user?.name && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: "16px",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{user.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>{user.email}</div>
                </div>
              </div>
            )}
          </div>

          {/* Form Card */}
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            overflow: "hidden", maxWidth: "640px",
          }}>
            <form onSubmit={submitHandler}>
              <div style={{ padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>

                {/* Name */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-user" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Full Name
                  </label>
                  <input
                    type="text" value={name} required
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Perera"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                    onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-envelope" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Email Address
                  </label>
                  <input
                    type="email" value={email} required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                    onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>

                {/* Role */}
                <div>
                  <label style={labelStyle}>
                    <i className="fa fa-shield" style={{ marginRight: "5px", color: "#1b6ca8" }} />
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isSelf}
                    style={{
                      ...inputStyle,
                      cursor: isSelf ? "not-allowed" : "pointer",
                      opacity: isSelf ? 0.6 : 1,
                    }}
                    onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                    onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>

                  {/* Self warning */}
                  {isSelf && (
                    <div style={{
                      marginTop: "8px", background: "#fff4e0",
                      borderRadius: "8px", padding: "8px 12px",
                      display: "flex", alignItems: "center", gap: "6px",
                      fontSize: "12px", color: "#b07800",
                    }}>
                      <i className="fa fa-exclamation-triangle" />
                      You cannot change your own role.
                    </div>
                  )}
                </div>

                {/* Role preview badge */}
                {role && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#888" }}>Current role:</span>
                    <span style={{
                      background: role === "admin"
                        ? "linear-gradient(135deg, #0f4c75, #0d7377)"
                        : "#f0f7ff",
                      color: role === "admin" ? "#fff" : "#1b6ca8",
                      borderRadius: "20px", padding: "4px 14px",
                      fontSize: "12px", fontWeight: 700,
                      display: "inline-flex", alignItems: "center", gap: "5px",
                    }}>
                      <i className={`fa fa-${role === "admin" ? "shield" : "user"}`} style={{ fontSize: "11px" }} />
                      {role}
                    </span>
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              <div style={{
                padding: "1.2rem 1.8rem",
                borderTop: "1px solid #f0f0f0",
                background: "#f8f9fa",
                display: "flex", alignItems: "center",
                justifyContent: "flex-end", gap: "10px",
              }}>
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
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
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading
                      ? "#ccc"
                      : "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                    color: "#fff", border: "none",
                    padding: "10px 28px", borderRadius: "8px",
                    fontSize: "14px", fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: "8px",
                    fontFamily: "inherit",
                  }}
                >
                  <i className={`fa ${loading ? "fa-spinner fa-spin" : "fa-check-circle"}`} />
                  {loading ? "Updating..." : "Update User"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}