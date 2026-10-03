import axios from "axios";
import {
  vehiclesRequest, vehiclesSuccess, vehiclesFail,
  vehicleRequest,  vehicleSuccess,  vehicleFail,
  bookVehicleRequest, bookVehicleSuccess, bookVehicleFail,
  myBookingsRequest,  myBookingsSuccess,  myBookingsFail,
  allBookingsRequest, allBookingsSuccess, allBookingsFail,
  updateBookingRequest, updateBookingSuccess, updateBookingFail,
  deleteBookingRequest, deleteBookingSuccess, deleteBookingFail,
  createVehicleRequest, createVehicleSuccess, createVehicleFail,
  updateVehicleRequest, updateVehicleSuccess, updateVehicleFail,
  deleteVehicleRequest, deleteVehicleSuccess, deleteVehicleFail,
} from "../slices/vehicleSlice";

// ── GET ALL VEHICLES ──────────────────────────────────────────
export const getVehicles = (type = "", maxPrice = 50000, available = "") => async (dispatch) => {
  try {
    dispatch(vehiclesRequest());
    let url = `/api/v1/vehicles?maxPrice=${maxPrice}`;
    if (type)      url += `&type=${type}`;
    if (available) url += `&available=${available}`;
    const { data } = await axios.get(url);
    dispatch(vehiclesSuccess(data));
  } catch (error) {
    dispatch(vehiclesFail(error.response?.data?.message || error.message));
  }
};

// ── GET SINGLE VEHICLE ────────────────────────────────────────
export const getVehicle = (id) => async (dispatch) => {
  try {
    dispatch(vehicleRequest());
    const { data } = await axios.get(`/api/v1/vehicle/${id}`);
    dispatch(vehicleSuccess(data));
  } catch (error) {
    dispatch(vehicleFail(error.response?.data?.message || error.message));
  }
};

// ── BOOK VEHICLE ──────────────────────────────────────────────
export const bookVehicle = (id, bookingData) => async (dispatch) => {
  try {
    dispatch(bookVehicleRequest());
    const { data } = await axios.post(`/api/v1/vehicle/${id}/book`, bookingData);
    dispatch(bookVehicleSuccess(data));
  } catch (error) {
    dispatch(bookVehicleFail(error.response?.data?.message || error.message));
  }
};

// ── MY BOOKINGS ───────────────────────────────────────────────
export const getMyBookings = () => async (dispatch) => {
  try {
    dispatch(myBookingsRequest());
    const { data } = await axios.get("/api/v1/my/vehicle/bookings");
    dispatch(myBookingsSuccess(data));
  } catch (error) {
    dispatch(myBookingsFail(error.response?.data?.message || error.message));
  }
};

// ── ADMIN: GET ALL BOOKINGS ───────────────────────────────────
export const getAllBookings = () => async (dispatch) => {
  try {
    dispatch(allBookingsRequest());
    const { data } = await axios.get("/api/v1/admin/vehicle/bookings");
    dispatch(allBookingsSuccess(data));
  } catch (error) {
    dispatch(allBookingsFail(error.response?.data?.message || error.message));
  }
};

// ── ADMIN: UPDATE BOOKING ─────────────────────────────────────
export const updateBooking = (id, bookingData) => async (dispatch) => {
  try {
    dispatch(updateBookingRequest());
    await axios.put(`/api/v1/admin/vehicle/booking/${id}`, bookingData);
    dispatch(updateBookingSuccess());
  } catch (error) {
    dispatch(updateBookingFail(error.response?.data?.message || error.message));
  }
};

// ── ADMIN: DELETE BOOKING ─────────────────────────────────────
export const deleteBooking = (id) => async (dispatch) => {
  try {
    dispatch(deleteBookingRequest());
    await axios.delete(`/api/v1/admin/vehicle/booking/${id}`);
    dispatch(deleteBookingSuccess());
  } catch (error) {
    dispatch(deleteBookingFail(error.response?.data?.message || error.message));
  }
};

// ── ADMIN: CREATE VEHICLE ─────────────────────────────────────
export const createVehicle = (formData) => async (dispatch) => {
  try {
    dispatch(createVehicleRequest());
    const { data } = await axios.post("/api/v1/admin/vehicle/new", formData);
    dispatch(createVehicleSuccess(data));
  } catch (error) {
    dispatch(createVehicleFail(error.response?.data?.message || error.message));
  }
};

// ── ADMIN: UPDATE VEHICLE ─────────────────────────────────────
export const updateVehicle = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateVehicleRequest());
    const { data } = await axios.put(`/api/v1/admin/vehicle/${id}`, formData);
    dispatch(updateVehicleSuccess(data));
  } catch (error) {
    dispatch(updateVehicleFail(error.response?.data?.message || error.message));
  }
};

// ── ADMIN: DELETE VEHICLE ─────────────────────────────────────
export const deleteVehicle = (id) => async (dispatch) => {
  try {
    dispatch(deleteVehicleRequest());
    await axios.delete(`/api/v1/admin/vehicle/${id}`);
    dispatch(deleteVehicleSuccess());
  } catch (error) {
    dispatch(deleteVehicleFail(error.response?.data?.message || error.message));
  }
};

// ── ADMIN: GET ALL VEHICLES ───────────────────────────────────
export const getAdminVehicles = () => async (dispatch) => {
  try {
    dispatch(vehiclesRequest());
    const { data } = await axios.get("/api/v1/admin/vehicles");
    dispatch(vehiclesSuccess(data));
  } catch (error) {
    dispatch(vehiclesFail(error.response?.data?.message || error.message));
  }
};