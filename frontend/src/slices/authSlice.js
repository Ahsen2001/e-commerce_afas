import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    isAuthenticated: false,
    isUpdated: false,
    user: null,
    error: null,
  },

  reducers: {
    // ----- LOGIN -----
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user; // expects { user: {...} }
    },
    loginFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- REGISTER -----
    registerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user; // expects { user: {...} }
    },
    registerFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- LOAD USER -----
    loadUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user; // expects { user: {...} }
    },
    loadUserFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
     
    },
    // ----- UPDATE PROFILE -----
    updateProfileRequest(state) {
      state.isAuthenticated = true;
      state.loading = true;
      state.isUpdated = false;
      state.error = null;
    },

    updateProfileSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.isUpdated = true;
      state.user = action.payload.user;
      state.error = null;
    },

    updateProfileFail(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.isUpdated = false;
      state.error = action.payload;
    },

    updateProfileReset(state) {
      state.isUpdated = false;
    },
    // ----- UPDATE PASSWORD -----
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.isUpdated = false;
    },

    updatePasswordSuccess(state) {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
    },

    updatePasswordFail(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },

    // ----- RESET UPDATE FLAG -----
    updatePasswordReset(state) {
      state.isUpdated = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.isUpdated = false;
    },

    forgotPasswordSuccess(state) {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
    },

    forgotPasswordFail(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },

    forgotPasswordReset(state) {
      state.isUpdated = false;
    },

    // ----- RESET PASSWORD -----
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.isUpdated = false;
    },

    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.isAuthenticated = true;
      state.user = action.payload?.user || state.user;
      state.error = null;
    },

    resetPasswordFail(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },

    resetPasswordReset(state) {
      state.isUpdated = false;
    },

    // ----- COMMON -----
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const {
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
  updateProfileReset,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  updatePasswordReset,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  forgotPasswordReset,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  resetPasswordReset,
  clearError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
