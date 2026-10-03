// ===================== Imports =====================
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors"); // ✅ ADD THIS
const itineraryRoutes = require('./routes/itineraryRoutes');
// In app.js — add with your other route imports
const vehicleRoutes = require("./routes/vehicleRoutes");

dotenv.config({ path: path.join(__dirname, "./config/config.env") });

// ===================== App Initialization =====================
const app = express();

// ===================== CORS (IMPORTANT FIX) =====================
app.use(cors({
  origin: "http://localhost:3000",
    credentials: true,
}));

// ===================== Middleware =====================
app.use(express.json());
app.use(cookieParser());

// static folder
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ===================== Route Imports =====================
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");


// ===================== API Routes =====================
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/itineraries", itineraryRoutes);
// Add with your other app.use() route mounts
app.use("/api/v1", vehicleRoutes);


// vehicle routes


// ===================== Error Middleware =====================
const errorMiddleware = require("./middlewares/error");
app.use(errorMiddleware);

// ===================== Export App =====================
module.exports = app;