const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter vehicle name"],
      trim: true,
      maxLength: [100, "Vehicle name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      enum: ["Car", "Van", "Bike", "Bus", "SUV", "Tuk-Tuk"],
      required: [true, "Please select vehicle type"],
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Please enter price per day"],
      min: [0, "Price cannot be negative"],
    },
    seats: {
      type: Number,
      required: [true, "Please enter number of seats"],
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      default: "Petrol",
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Manual",
    },
    available: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        image: { type: String, required: true },
      },
    ],
    location: {
      type: String,
      default: "Colombo",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ✅ NEW — tracks which vendor owns this vehicle
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);