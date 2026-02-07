import axios from "axios";
import {
  loginRequest,
  loginSuccess,
  loginFail,

  registerRequest,
  registerSuccess,
  registerFail,
} from "../slices/authSlice";


// -------- LOGIN --------
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    console.log("LOGIN API RESPONSE:", data);

    dispatch(loginSuccess({ user: data?.user ?? data }));
  } catch (error) {
    console.log("LOGIN ERROR:", error?.response?.data || error.message);

    dispatch(
      loginFail(
        error?.response?.data?.message || "Login failed. Please try again."
      )
    );
  }
};

// -------- REGISTER --------
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data } = await axios.post(
      "/api/v1/register",
      userData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    console.log("REGISTER API RESPONSE:", data);

    // Auto login after register
    dispatch(registerSuccess({ user: data?.user ?? data }));
  } catch (error) {
    console.log("REGISTER ERROR:", error?.response?.data || error.message);

    dispatch(
      registerFail(
        error?.response?.data?.message || "Registration failed. Please try again."
      )
    );
  }
};