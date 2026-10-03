import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword } from "../../actions/authActions";
import { clearError, forgotPasswordReset } from "../../slices/authSlice";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { error, isUpdated, loading } = useSelector((state) => state.auth);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Reset password email sent successfully", {
        position: "bottom-center",
      });
      setEmail("");
      dispatch(forgotPasswordReset());
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
      });
      dispatch(clearError());
    }
  }, [isUpdated, error, dispatch]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg p-4">
          <h1 className="mb-3">Forgot Password</h1>

          <div className="form-group">
            <label htmlFor="email_field">Enter Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            className="btn btn-block py-3"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
}