import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    isAuthenticated: false,
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
      state.user = action.payload.user;   // expects { user: {...} }
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
      state.user = action.payload.user;   // expects { user: {...} }
    },

    registerFail(state, action) {
      state.loading = false;
      state.error = action.payload;
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

  clearError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;