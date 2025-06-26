const express = require("express");
const router = express.Router();

// TODO: Import auth controller
// const authController = require('../../controllers/authController');

// Auth routes
router.post("/register", (req, res) => {
  res.status(501).json({ message: "Register endpoint - not implemented yet" });
});

router.post("/login", (req, res) => {
  res.status(501).json({ message: "Login endpoint - not implemented yet" });
});

router.post("/logout", (req, res) => {
  res.status(501).json({ message: "Logout endpoint - not implemented yet" });
});

router.get("/me", (req, res) => {
  res
    .status(501)
    .json({ message: "Get current user endpoint - not implemented yet" });
});

module.exports = router;
