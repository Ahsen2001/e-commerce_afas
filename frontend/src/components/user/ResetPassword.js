import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { resetPassword } from "../../actions/authActions";
import { clearError, resetPasswordReset } from "../../slices/authSlice";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { isAuthenticated, isUpdated, error, loading } = useSelector(
    (state) => state.auth
  );

  const submitHandler = (e) => {
    e.preventDefault();

    const passwords = {
      password,
      confirmPassword,
    };

    dispatch(resetPassword(token, passwords));
  };

  useEffect(() => {
    if (isUpdated || isAuthenticated) {
      toast.success("Password Reset Success!", {
        position: "bottom-center",
      });
      dispatch(resetPasswordReset());
      navigate("/");
      return;
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
      });
      dispatch(clearError());
    }
  }, [isUpdated, isAuthenticated, error, dispatch, navigate]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg p-4">
          <h1 className="mb-3">New Password</h1>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            id="new_password_button"
            type="submit"
            className="btn btn-primary w-100 py-3 mt-3"
            disabled={loading}
          >
            {loading ? "Setting..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}