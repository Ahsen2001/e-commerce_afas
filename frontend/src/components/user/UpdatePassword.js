import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updatePassword as updatePasswordAction } from "../../actions/authActions";
import { clearError, updatePasswordReset } from "../../slices/authSlice";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const dispatch = useDispatch();
  const { isUpdated, error, loading } = useSelector((state) => state.auth);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updatePasswordAction({ oldPassword, newPassword: password }));
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Password updated successfully", { position: "bottom-center" });
      setOldPassword("");
      setPassword("");
      dispatch(updatePasswordReset());
    }
    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
    }
  }, [isUpdated, error, dispatch]);

  const inputStyle = {
    borderRadius: "8px", border: "1.5px solid #e0e0e0",
    padding: "10px 40px 10px 14px", fontSize: "15px",
    width: "100%", outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-box" style={{ padding: 0, overflow: "hidden", maxWidth: "560px" }}>

        {/* Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
          padding: "1.8rem 2rem",
          display: "flex", alignItems: "center", gap: "1rem",
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="fa fa-lock" style={{ color: "#5ce1e6", fontSize: "16px" }} />
          </div>
          <div>
            <h2 style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: "20px" }}>
              Change Password
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
              Keep your account secure
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: "2rem" }}>
          <form onSubmit={submitHandler}>

            {/* Old Password */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{
                fontSize: "12px", fontWeight: 700, color: "#555",
                textTransform: "uppercase", letterSpacing: "0.5px",
                marginBottom: "6px", display: "block",
              }}>
                <i className="fa fa-key" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                Current Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showOld ? "text" : "password"}
                  id="old_password_field"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                  onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                  placeholder="Enter current password"
                />
                <span
                  onClick={() => setShowOld(!showOld)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", cursor: "pointer",
                    color: "#999", fontSize: "14px",
                  }}
                >
                  <i className={`fa ${showOld ? "fa-eye-slash" : "fa-eye"}`} />
                </span>
              </div>
            </div>

            {/* New Password */}
            <div style={{ marginBottom: "1.8rem" }}>
              <label style={{
                fontSize: "12px", fontWeight: 700, color: "#555",
                textTransform: "uppercase", letterSpacing: "0.5px",
                marginBottom: "6px", display: "block",
              }}>
                <i className="fa fa-shield" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  id="new_password_field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                  onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                  placeholder="Enter new password"
                />
                <span
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", cursor: "pointer",
                    color: "#999", fontSize: "14px",
                  }}
                >
                  <i className={`fa ${showNew ? "fa-eye-slash" : "fa-eye"}`} />
                </span>
              </div>

              {/* Password strength hint */}
              {password.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} style={{
                      height: "4px", flex: 1, borderRadius: "2px",
                      background: password.length >= level * 2
                        ? level <= 1 ? "#e74c3c"
                          : level <= 2 ? "#fa9c23"
                            : level <= 3 ? "#1b6ca8"
                              : "#2ecc71"
                        : "#e0e0e0",
                      transition: "background 0.3s",
                    }} />
                  ))}
                  <span style={{ fontSize: "11px", color: "#999", whiteSpace: "nowrap" }}>
                    {password.length < 2 ? "Too short"
                      : password.length < 4 ? "Weak"
                        : password.length < 6 ? "Fair"
                          : password.length < 8 ? "Good"
                            : "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading
                  ? "#ccc"
                  : "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                color: "#fff", border: "none",
                padding: "12px", borderRadius: "10px",
                fontSize: "15px", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              <i className={`fa ${loading ? "fa-spinner fa-spin" : "fa-save"}`} />
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}