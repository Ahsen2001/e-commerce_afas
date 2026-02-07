import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/authActions";
import { clearError } from "../../slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";


export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        toast.error("Image size should be less than 1MB", {
          position: "bottom-center",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file", {
          position: "bottom-center",
        });
        return;
      }

      setAvatar(file);
    } else {
      setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userData.name.trim() || !userData.email.trim() || !userData.password) {
      toast.error("Please fill in all fields", {
        position: "bottom-center",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", userData.name.trim());
    formData.append("email", userData.email.trim());
    formData.append("password", userData.password);

    if (avatar) formData.append("avatar", avatar);

    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <form
          onSubmit={submitHandler}
          className="register-form"
          encType="multipart/form-data"
        >
          <h1 className="register-title">Create Account</h1>

          <div className="register-links">
            <Link to="/login">Already have an account? Sign in</Link>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              name="name"
              onChange={onChange}
              type="text"
              className="form-control"
              value={userData.name}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              onChange={onChange}
              className="form-control"
              value={userData.email}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              onChange={onChange}
              type="password"
              className="form-control"
              value={userData.password}
              required
              minLength={6}
            />
          </div>

          {/* SIMPLE FILE UPLOAD */}
          <div className="form-group">
            <label className="form-label">
              Profile Picture (Optional)
            </label>

            <div className="avatar-upload-container">
              <input
                type="file"
                name="avatar"
                id="avatar_input"
                accept="image/*"
                onChange={onChange}
                className="file-input"
              />

              <div className="file-upload-controls">
                <label htmlFor="avatar_input" className="file-upload-btn">
                  Choose Image
                </label>

                <div className="file-info">
                  <span className="file-name">
                    {avatar ? avatar.name : "No file chosen"}
                  </span>

                  {avatar && (
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => setAvatar(null)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <small className="file-hint">
                Recommended: max 1MB
              </small>
            </div>
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}