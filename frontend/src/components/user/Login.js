import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import { login } from "../../actions/authActions"; // ✅ correct
import { clearError } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ get state from Redux
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("LOGIN CLICKED", email, password);
    dispatch(login(email, password));
  };

  return (
    <Fragment>
      <MetaData title="Login" />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-3">Login</h1>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-links">
              <Link to="/password/forgot">Forgot Password?</Link>
              <Link to="/register">New User?</Link>
            </div>

            <button
              id="login_button"
              type="submit"
              className="btn py-3 w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
