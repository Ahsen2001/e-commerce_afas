import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { loading: false, user: {}, users: [], isUserUpdated: false, isUserDeleted: false, error: null },
  reducers: {
    usersRequest:     (state) => { state.loading = true; state.error = null; },
    usersSuccess:     (state, action) => { state.loading = false; state.users = action.payload; },
    usersFail:        (state, action) => { state.loading = false; state.error = action.payload; },

    userRequest:      (state) => { state.loading = true; state.error = null; },
    userSuccess:      (state, action) => { state.loading = false; state.user = action.payload.user; },
    userFail:         (state, action) => { state.loading = false; state.error = action.payload; },

    deleteUserRequest: (state) => { state.loading = true; state.error = null; },
    deleteUserSuccess: (state) => { state.loading = false; state.isUserDeleted = true; },
    deleteUserFail:    (state, action) => { state.loading = false; state.error = action.payload; },
    clearUserDeleted:  (state) => { state.isUserDeleted = false; },

    updateUserRequest: (state) => { state.loading = true; state.error = null; },
    updateUserSuccess: (state) => { state.loading = false; state.isUserUpdated = true; },
    updateUserFail:    (state, action) => { state.loading = false; state.error = action.payload; },
    clearUserUpdated:  (state) => { state.isUserUpdated = false; },

    clearError: (state) => { state.error = null; },
  },
});

export const {
  usersRequest, usersSuccess, usersFail,
  userRequest, userSuccess, userFail,
  deleteUserRequest, deleteUserSuccess, deleteUserFail, clearUserDeleted,
  updateUserRequest, updateUserSuccess, updateUserFail, clearUserUpdated,
  clearError,
} = userSlice.actions;
export default userSlice.reducer;