import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../../src/App.css";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile-wrapper">
      <div className="profile-box" style={{ padding: 0, overflow: "hidden" }}>

        {/* Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}>
          <div style={{ position: "relative" }}>
            <img
              src={user?.avatar?.url || "/images/default_avatar.png"}
              alt="profile"
              style={{
                width: "100px", height: "100px", borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(255,255,255,0.5)",
              }}
            />
            <span style={{
              position: "absolute", bottom: "4px", right: "4px",
              width: "14px", height: "14px", borderRadius: "50%",
              background: "#2ecc71", border: "2px solid #fff",
            }} />
          </div>
          <div>
            <h2 style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: "22px" }}>
              {user?.name}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: "4px 0 0", fontSize: "14px" }}>
              <i className="fa fa-envelope" style={{ marginRight: "6px" }} />
              {user?.email}
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", margin: "4px 0 0", fontSize: "13px" }}>
              <i className="fa fa-calendar" style={{ marginRight: "6px" }} />
              Member since {user?.createdAt?.substring(0, 10)}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem" }}>
          <div className="row">

            {/* Info Cards */}
            <div className="col-12 col-md-8">
              <h5 style={{ fontWeight: 700, color: "#1b6ca8", marginBottom: "1rem", fontSize: "16px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                <i className="fa fa-user-circle" style={{ marginRight: "8px" }} />
                Account Details
              </h5>

              {/* Name Card */}
              <div style={{
                background: "#f8f9fa", borderRadius: "10px",
                padding: "1rem 1.2rem", marginBottom: "12px",
                border: "1px solid #eee",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <i className="fa fa-user" style={{ color: "#fff", fontSize: "14px" }} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</div>
                  <div style={{ fontSize: "15px", color: "#222", fontWeight: 600 }}>{user?.name}</div>
                </div>
              </div>

              {/* Email Card */}
              <div style={{
                background: "#f8f9fa", borderRadius: "10px",
                padding: "1rem 1.2rem", marginBottom: "12px",
                border: "1px solid #eee",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <i className="fa fa-envelope" style={{ color: "#fff", fontSize: "14px" }} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</div>
                  <div style={{ fontSize: "15px", color: "#222", fontWeight: 600 }}>{user?.email}</div>
                </div>
              </div>

              {/* Joined Card */}
              <div style={{
                background: "#f8f9fa", borderRadius: "10px",
                padding: "1rem 1.2rem", marginBottom: "12px",
                border: "1px solid #eee",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <i className="fa fa-calendar" style={{ color: "#fff", fontSize: "14px" }} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Member Since</div>
                  <div style={{ fontSize: "15px", color: "#222", fontWeight: 600 }}>{user?.createdAt?.substring(0, 10)}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-12 col-md-4">
              <h5 style={{ fontWeight: 700, color: "#1b6ca8", marginBottom: "1rem", fontSize: "16px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                <i className="fa fa-cog" style={{ marginRight: "8px" }} />
                Quick Actions
              </h5>

              <Link to="/myprofile/update" style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "linear-gradient(135deg, #0f4c75, #1b6ca8)",
                color: "#fff", textDecoration: "none",
                padding: "12px 16px", borderRadius: "10px",
                marginBottom: "10px", fontWeight: 600, fontSize: "14px",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <i className="fa fa-edit" style={{ fontSize: "15px" }} />
                Edit Profile
              </Link>

              <Link to="/orders" style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "linear-gradient(135deg, #0d7377, #14a085)",
                color: "#fff", textDecoration: "none",
                padding: "12px 16px", borderRadius: "10px",
                marginBottom: "10px", fontWeight: 600, fontSize: "14px",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <i className="fa fa-box" style={{ fontSize: "15px" }} />
                My Orders
              </Link>

              <Link to="/myprofile/update/password" style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "#fff", color: "#1b6ca8", textDecoration: "none",
                padding: "12px 16px", borderRadius: "10px",
                marginBottom: "10px", fontWeight: 600, fontSize: "14px",
                border: "1.5px solid #1b6ca8",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1b6ca8"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1b6ca8"; }}
              >
                <i className="fa fa-lock" style={{ fontSize: "15px" }} />
                Change Password
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}