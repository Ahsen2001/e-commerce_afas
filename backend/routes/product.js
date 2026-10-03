const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// controllers
const {
  getProducts,
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    createReview, 
    getReviews, 
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");

// auth
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

// ================= UPLOAD PATH =================
const uploadPath = path.join(__dirname, "../public/uploads/product");

// create folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const cleanName = file.originalname
      .replace(ext, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // ✅ FIXED (no timestamp)
    cb(null, `${cleanName}${ext}`);
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// PRODUCTS
router.get("/products", getProducts);

router.route("/product/:id").get(getSingleProduct);

// REVIEWS
router
  .route("/review")
  .put(isAuthenticatedUser, createReview)
  .delete(deleteReview);

// ================= ADMIN =================
router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 5),
  newProduct,
);

router.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct,
);

router.get(
  "/admin/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminProducts,
);
router.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images"),
  updateProduct,
);

router.get(
  "/admin/reviews",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getReviews,
);

router.delete(
  "/admin/reviews",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteReview,
);

module.exports = router;
