// ============================================
// backend/models/vehicleBookingModel.js
// ============================================
const mongoose = require("mongoose");

const vehicleBookingSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: [true, "Please provide pickup date"],
    },
    returnDate: {
      type: Date,
      required: [true, "Please provide return date"],
    },
    pickupLocation: {
      type: String,
      required: [true, "Please provide pickup location"],
    },
    totalDays: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleBooking", vehicleBookingSchema);