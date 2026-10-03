import axios from "../axios";

import {
  loginRequest,
  loginSuccess,
  loginFail,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  logout as logoutAction,
} from "../slices/authSlice";

import {
  usersRequest,
  usersSuccess,
  usersFail,
  userRequest,
  userSuccess,  
  userFail,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFail,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
} from "../slices/userSlice";

// -------- LOGIN --------
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());

        const { data } = await axios.post(
            "/api/v1/login",
            { email, password },
            { withCredentials: true }
        );

        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(
            loginFail(
                error.response?.data?.message || error.message
            )
        );
    }
};

// -------- REGISTER --------
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data } = await axios.post("/api/v1/register", userData, {
      headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });

    console.log("REGISTER API RESPONSE:", data);

    dispatch(registerSuccess({ user: data?.user ?? data }));
  } catch (error) {
    console.log("REGISTER ERROR:", error?.response?.data || error.message);

    dispatch(
      registerFail(
        error?.response?.data?.message ||
          "Registration failed. Please try again.",
      ),
    );
  }
};

// -------- LOAD USER --------
export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());

        const { data } = await axios.get(
            "/api/v1/myprofile",
            {
                withCredentials: true,
            }
        );

        dispatch(loadUserSuccess(data));
    } catch (error) {
        dispatch(loadUserFail());
    }
};

// -------- LOGOUT --------
export const logoutUser = () => async (dispatch) => {
  console.log("logout action called");

  try {
    await axios.get("/api/v1/logout", {
        withCredentials: true,
    });
    console.log("logout api success");
  } catch (error) {
    console.log("LOGOUT ERROR:", error?.response?.data || error.message);
  } finally {
    dispatch(logoutAction());
  }
};

// -------- UPDATE PROFILE --------
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());

    const { data } = await axios.put("/api/v1/update", userData, {
        headers: {
        "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    console.log("UPDATE PROFILE RESPONSE:", data);

    dispatch(updateProfileSuccess({ user: data?.user ?? data }));
  } catch (error) {
    console.log(
      "UPDATE PROFILE ERROR:",
      error?.response?.data || error.message
    );

    dispatch(
      updateProfileFail(
        error?.response?.data?.message || "Profile update failed"
      )
    );
  }
};

// -------- Update Password --------
export const updatePassword = (formData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());

    const { data } = await axios.put("/api/v1/password/change", formData, {
      headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });

    console.log("UPDATE PASSWORD RESPONSE:", data);

    dispatch(updatePasswordSuccess());
  } catch (error) {
    console.log(
      "UPDATE PASSWORD ERROR:",
      error?.response?.data || error.message,
    );

    dispatch(
      updatePasswordFail(
        error?.response?.data?.message || "Password update failed",
      ),
    );
  }
};

// -------- FORGOT PASSWORD --------
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());

    // removed unused 'data' variable
    await axios.post(
      "/api/v1/password/forgot",
      { email },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );

    dispatch(forgotPasswordSuccess());
  } catch (error) {
    dispatch(
      forgotPasswordFail(
        error?.response?.data?.message || "Forgot password request failed",
      ),
    );
  }
};

// -------- RESET PASSWORD --------
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());

    // removed unused 'data' variable
    const response = await axios.post(
      `/api/v1/password/reset/${token}`,
      passwords,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    console.log("RESET PASSWORD RESPONSE:", response.data);

    dispatch(resetPasswordSuccess(response.data));
    await dispatch(loadUser());
  } catch (error) {
    console.log(
      "RESET PASSWORD ERROR:",
      error?.response?.data || error.message
    );

    dispatch(
      resetPasswordFail(
        error?.response?.data?.message || "Reset password failed"
      )
    );
  }
};


// Get all users (Admin)
export const getUsers = () => async (dispatch) => {
  try {
    dispatch(usersRequest());

    const { data } = await axios.get("/api/v1/admin/users", { withCredentials: true });

    dispatch(usersSuccess(data.users));
  } catch (error) {
    dispatch(
      usersFail(
        error?.response?.data?.message || "Unable to load users"
      )
    );
  }
};

// Get user details (Admin)
export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await axios.get(`/api/v1/admin/user/${id}`, { withCredentials: true });
    dispatch(userSuccess(data.user));
  } catch (error) {
    dispatch(
      userFail(
        error?.response?.data?.message || "Unable to load user details"
      )
    );
  }
};

// Delete user (Admin)
export const deleteUser = (id) => async (dispatch) => {
  try { dispatch(deleteUserRequest());
    await axios.delete(`/api/v1/admin/user/${id}`, { withCredentials: true });
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(
      deleteUserFail(
        error?.response?.data?.message || "Unable to delete user"
      )
    );
  }
};

// Update user (Admin)
export const updateUser = (id, userData) => async (dispatch) => {
  try { dispatch(updateUserRequest());
    const config = {
      headers: { "Content-Type": "application/json" },
        withCredentials: true,
    };
    const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config);
    dispatch(updateUserSuccess(data.user));
  } catch (error) {
    dispatch(
      updateUserFail(
        error?.response?.data?.message || "Unable to update user"
      )
    );
  }
};
