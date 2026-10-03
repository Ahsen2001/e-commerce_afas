// ============================================
// backend/controllers/vehicleController.js
// ============================================
const Vehicle        = require("../models/vehicleModel");
const VehicleBooking = require("../models/vehicleBookingModel");
const ErrorHandler   = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const path = require("path");
const fs   = require("fs");

// ── GET ALL VEHICLES  /api/v1/vehicles ──────────────────────
exports.getVehicles = catchAsyncError(async (req, res, next) => {
  const { type, maxPrice, available } = req.query;
  const query = {};

  if (type)      query.type      = type;
  if (available) query.available = available === "true";
  if (maxPrice)  query.pricePerDay = { $lte: Number(maxPrice) };

  const vehicles = await Vehicle.find(query);

  res.status(200).json({
    success: true,
    count: vehicles.length,
    vehicles,
  });
});

// ── GET SINGLE VEHICLE  /api/v1/vehicle/:id ─────────────────
exports.getVehicle = catchAsyncError(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorHandler("Vehicle not found", 404));
  }

  res.status(200).json({ success: true, vehicle });
});

// ── BOOK VEHICLE  /api/v1/vehicle/:id/book ──────────────────
exports.bookVehicle = catchAsyncError(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorHandler("Vehicle not found", 404));
  }

  if (!vehicle.available) {
    return next(new ErrorHandler("Vehicle is not available", 400));
  }

  const { pickupDate, returnDate, pickupLocation } = req.body;

  if (!pickupDate || !returnDate || !pickupLocation) {
    return next(new ErrorHandler("Please provide all booking details", 400));
  }

  const pickup = new Date(pickupDate);
  const ret    = new Date(returnDate);

  if (ret <= pickup) {
    return next(new ErrorHandler("Return date must be after pickup date", 400));
  }

  const totalDays  = Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24));
  const totalPrice = totalDays * vehicle.pricePerDay;

  const booking = await VehicleBooking.create({
    vehicle:        vehicle._id,
    user:           req.user._id,
    pickupDate:     pickup,
    returnDate:     ret,
    pickupLocation,
    totalDays,
    totalPrice,
  });

  res.status(201).json({ success: true, booking });
});

// ── MY BOOKINGS  /api/v1/my/vehicle/bookings ────────────────
exports.getMyBookings = catchAsyncError(async (req, res, next) => {
  const bookings = await VehicleBooking.find({ user: req.user._id })
    .populate("vehicle", "name type images pricePerDay location");

  res.status(200).json({ success: true, bookings });
});

// ── ADMIN: GET ALL BOOKINGS  /api/v1/admin/vehicle/bookings ─
exports.getAllBookings = catchAsyncError(async (req, res, next) => {
  const bookings = await VehicleBooking.find()
    .populate("vehicle", "name type pricePerDay")
    .populate("user",    "name email");

  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

  res.status(200).json({ success: true, count: bookings.length, totalRevenue, bookings });
});

// ── ADMIN: UPDATE BOOKING STATUS  /api/v1/admin/vehicle/booking/:id ─
exports.updateBookingStatus = catchAsyncError(async (req, res, next) => {
  const booking = await VehicleBooking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  booking.status = req.body.status || booking.status;
  booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;

  await booking.save();

  res.status(200).json({ success: true, booking });
});

// ── ADMIN: DELETE BOOKING  /api/v1/admin/vehicle/booking/:id ─
exports.deleteBooking = catchAsyncError(async (req, res, next) => {
  const booking = await VehicleBooking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  await booking.deleteOne();

  res.status(200).json({ success: true, message: "Booking deleted successfully" });
});

// ── ADMIN: CREATE VEHICLE  /api/v1/admin/vehicle/new ────────
exports.createVehicle = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const url = `${process.env.BACKEND_URL}/uploads/vehicle/${file.originalname}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;
  req.body.user   = req.user.id;
  req.body.owner  = req.user.id;

  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({ success: true, vehicle });
});

// ── ADMIN: UPDATE VEHICLE  /api/v1/admin/vehicle/:id ────────
exports.updateVehicle = catchAsyncError(async (req, res, next) => {
  let vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorHandler("Vehicle not found", 404));
  }

  let images = [];

  if (req.body.imagesCleared === "false") {
    images = vehicle.images;
  }

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const url = `${process.env.BACKEND_URL}/uploads/vehicle/${file.originalname}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, vehicle });
});

// ── ADMIN: DELETE VEHICLE  /api/v1/admin/vehicle/:id ────────
exports.deleteVehicle = catchAsyncError(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorHandler("Vehicle not found", 404));
  }

  await vehicle.deleteOne();

  res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
});

// ── ADMIN: GET ALL VEHICLES  /api/v1/admin/vehicles ─────────
exports.getAdminVehicles = catchAsyncError(async (req, res, next) => {
  const vehicles = await Vehicle.find();

  res.status(200).json({ success: true, count: vehicles.length, vehicles });
});