// ============================================
// backend/routes/vehicleRoutes.js
// ============================================
const express = require("express");
const router  = express.Router();
const path    = require("path");
const multer  = require("multer");
const fs      = require("fs");

const {
  getVehicles,
  getVehicle,
  bookVehicle,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAdminVehicles,
} = require("../controllers/vehicleController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

// ── Multer setup ─────────────────────────────
const uploadPath = path.join(__dirname, "../public/uploads/vehicle");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext       = path.extname(file.originalname);
    const cleanName = file.originalname
      .replace(ext, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    cb(null, `${cleanName}${ext}`);
  },
});

const upload = multer({ storage });

// ── Public routes ────────────────────────────
router.get("/vehicles",      getVehicles);
router.get("/vehicle/:id",   getVehicle);

// ── Protected routes (logged in users) ───────
router.post(
  "/vehicle/:id/book",
  isAuthenticatedUser,
  bookVehicle
);

router.get(
  "/my/vehicle/bookings",
  isAuthenticatedUser,
  getMyBookings
);

// ── Admin routes ─────────────────────────────
router.post(
  "/admin/vehicle/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 5),
  createVehicle
);

router.get(
  "/admin/vehicles",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminVehicles
);

router.get(
  "/admin/vehicle/bookings",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllBookings
);

router
  .route("/admin/vehicle/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images", 5),
    updateVehicle
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteVehicle
  );

router
  .route("/admin/vehicle/booking/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateBookingStatus
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteBooking
  );

module.exports = router;