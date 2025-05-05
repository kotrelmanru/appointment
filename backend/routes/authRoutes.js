const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

const router = express.Router();

// Daftar dan Login sekarang tanpa password
router.post("/register", registerUser);
router.post("/login", loginUser);

// Mendapatkan profil, tetap butuh JWT
router.get("/profile", protect, getUserInfo);

module.exports = router;
