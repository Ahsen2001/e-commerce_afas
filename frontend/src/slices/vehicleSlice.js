import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    loading: false,
    vehicles: [],
    vehicle: null,
    bookings: [],
    allBookings: [],
    isBooked: false,
    bookingDetail: null,
    isBookingUpdated: false,
    isBookingDeleted: false,
    isVehicleCreated: false,
    isVehicleUpdated: false,
    isVehicleDeleted: false,
    error: null,
  },
  reducers: {
    // ── GET ALL VEHICLES ──
    vehiclesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    vehiclesSuccess: (state, action) => {
      state.loading = false;
      state.vehicles = action.payload.vehicles;
    },
    vehiclesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ── GET SINGLE VEHICLE ──
    vehicleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    vehicleSuccess: (state, action) => {
      state.loading = false;
      state.vehicle = action.payload.vehicle;
    },
    vehicleFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ── BOOK VEHICLE ──
    bookVehicleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    bookVehicleSuccess: (state, action) => {
      state.loading = false;
      state.isBooked = true;
      state.bookingDetail = action.payload;
    },
    bookVehicleFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearBookVehicle: (state) => {
      state.isBooked = false;
      state.bookingDetail = null;
    },

    // ── MY BOOKINGS ──
    myBookingsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    myBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload.bookings;
    },
    myBookingsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ── ADMIN: ALL BOOKINGS ──
    allBookingsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    allBookingsSuccess: (state, action) => {
      state.loading = false;
      state.allBookings = action.payload.bookings;
    },
    allBookingsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ── ADMIN: UPDATE BOOKING ──
    updateBookingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateBookingSuccess: (state) => {
      state.loading = false;
      state.isBookingUpdated = true;
    },
    updateBookingFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearBookingUpdated: (state) => {
      state.isBookingUpdated = false;
    },

    // ── ADMIN: DELETE BOOKING ──
    deleteBookingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBookingSuccess: (state) => {
      state.loading = false;
      state.isBookingDeleted = true;
    },
    deleteBookingFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearBookingDeleted: (state) => {
      state.isBookingDeleted = false;
    },

    // ── ADMIN: CREATE VEHICLE ──
    createVehicleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createVehicleSuccess: (state, action) => {
      state.loading = false;
      state.isVehicleCreated = true;
      state.vehicle = action.payload.vehicle;
    },
    createVehicleFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearVehicleCreated: (state) => {
      state.isVehicleCreated = false;
    },

    // ── ADMIN: UPDATE VEHICLE ──
    updateVehicleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateVehicleSuccess: (state, action) => {
      state.loading = false;
      state.isVehicleUpdated = true;
      state.vehicle = action.payload.vehicle;
    },
    updateVehicleFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearVehicleUpdated: (state) => {
      state.isVehicleUpdated = false;
    },

    // ── ADMIN: DELETE VEHICLE ──
    deleteVehicleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteVehicleSuccess: (state) => {
      state.loading = false;
      state.isVehicleDeleted = true;
    },
    deleteVehicleFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearVehicleDeleted: (state) => {
      state.isVehicleDeleted = false;
    },

    // ── ERROR ──
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  vehiclesRequest, vehiclesSuccess, vehiclesFail,
  vehicleRequest,  vehicleSuccess,  vehicleFail,
  bookVehicleRequest, bookVehicleSuccess, bookVehicleFail, clearBookVehicle,
  myBookingsRequest,  myBookingsSuccess,  myBookingsFail,
  allBookingsRequest, allBookingsSuccess, allBookingsFail,
  updateBookingRequest, updateBookingSuccess, updateBookingFail, clearBookingUpdated,
  deleteBookingRequest, deleteBookingSuccess, deleteBookingFail, clearBookingDeleted,
  createVehicleRequest, createVehicleSuccess, createVehicleFail, clearVehicleCreated,
  updateVehicleRequest, updateVehicleSuccess, updateVehicleFail, clearVehicleUpdated,
  deleteVehicleRequest, deleteVehicleSuccess, deleteVehicleFail, clearVehicleDeleted,
  clearError,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;