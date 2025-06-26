const express = require("express");
const router = express.Router();

// TODO: Import books controller
// const booksController = require('../../controllers/booksController');

// Books routes
router.get("/", (req, res) => {
  res
    .status(501)
    .json({ message: "Get all books endpoint - not implemented yet" });
});

router.get("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Get book by ID endpoint - not implemented yet" });
});

router.post("/", (req, res) => {
  res
    .status(501)
    .json({ message: "Create book endpoint - not implemented yet" });
});

router.put("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Update book endpoint - not implemented yet" });
});

router.delete("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Delete book endpoint - not implemented yet" });
});

module.exports = router;
