const express = require("express");
const router = express.Router();

// TODO: Import reviews controller
// const reviewsController = require('../../controllers/reviewsController');

// Reviews routes
router.get("/", (req, res) => {
  res
    .status(501)
    .json({ message: "Get all reviews endpoint - not implemented yet" });
});

router.get("/book/:bookId", (req, res) => {
  res
    .status(501)
    .json({ message: "Get reviews for book endpoint - not implemented yet" });
});

router.get("/user/:userId", (req, res) => {
  res
    .status(501)
    .json({ message: "Get user reviews endpoint - not implemented yet" });
});

router.post("/", (req, res) => {
  res
    .status(501)
    .json({ message: "Create review endpoint - not implemented yet" });
});

router.put("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Update review endpoint - not implemented yet" });
});

router.delete("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Delete review endpoint - not implemented yet" });
});

module.exports = router;
