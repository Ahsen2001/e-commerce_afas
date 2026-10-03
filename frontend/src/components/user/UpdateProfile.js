import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "../../actions/authActions";
import { updateProfileReset, clearError } from "../../slices/authSlice";

export default function UpdateProfile() {
  const { user, error, isUpdated } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || "/images/default_avatar.png"
  );
  const dispatch = useDispatch();

  // ✅ Fixed — readAsDataURL was never called before
  const onChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file); // ← this line was missing
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);
    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user?.avatar?.url || "/images/default_avatar.png");
    }
    if (isUpdated) {
      toast.success("Profile updated successfully!", { position: "bottom-center" });
      dispatch(updateProfileReset());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [user, isUpdated, error, dispatch]);

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
            <i className="fa fa-edit" style={{ color: "#5ce1e6", fontSize: "16px" }} />
          </div>
          <div>
            <h2 style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: "20px" }}>
              Update Profile
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: "2rem" }}>
          <form onSubmit={submitHandler} encType="multipart/form-data">

            {/* Avatar Upload */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #1b6ca8",
                  }}
                />
                <label htmlFor="customFile" style={{
                  position: "absolute", bottom: "0", right: "0",
                  width: "26px", height: "26px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", border: "2px solid #fff",
                }}>
                  <i className="fa fa-camera" style={{ color: "#fff", fontSize: "11px" }} />
                </label>
                <input
                  type="file"
                  name="avatar"
                  id="customFile"
                  accept="image/*"
                  onChange={onChangeAvatar}
                  style={{ display: "none" }}
                />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#222" }}>
                  Profile Photo
                </p>
                <label htmlFor="customFile" style={{
                  color: "#1b6ca8", fontSize: "13px", cursor: "pointer",
                  fontWeight: 600, textDecoration: "underline",
                }}>
                  Click to change photo
                </label>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#999" }}>
                  JPG, PNG or GIF — max 2MB
                </p>
              </div>
            </div>

            {/* Name Field */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{
                fontSize: "12px", fontWeight: 700, color: "#555",
                textTransform: "uppercase", letterSpacing: "0.5px",
                marginBottom: "6px", display: "block",
              }}>
                <i className="fa fa-user" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                Full Name
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  borderRadius: "8px", border: "1.5px solid #e0e0e0",
                  padding: "10px 14px", fontSize: "15px",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                onBlur={e => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: "1.8rem" }}>
              <label style={{
                fontSize: "12px", fontWeight: 700, color: "#555",
                textTransform: "uppercase", letterSpacing: "0.5px",
                marginBottom: "6px", display: "block",
              }}>
                <i className="fa fa-envelope" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                Email Address
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  borderRadius: "8px", border: "1.5px solid #e0e0e0",
                  padding: "10px 14px", fontSize: "15px",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                onBlur={e => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                color: "#fff", border: "none",
                padding: "12px", borderRadius: "10px",
                fontSize: "15px", fontWeight: 700,
                cursor: "pointer", transition: "opacity 0.2s",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <i className="fa fa-save" />
              Save Changes
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}