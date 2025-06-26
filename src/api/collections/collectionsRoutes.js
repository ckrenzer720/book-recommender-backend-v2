const express = require("express");
const router = express.Router();

// TODO: Import collections controller
// const collectionsController = require('../../controllers/collectionsController');

// Collections routes
router.get("/", (req, res) => {
  res
    .status(501)
    .json({ message: "Get user collections endpoint - not implemented yet" });
});

router.get("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Get collection by ID endpoint - not implemented yet" });
});

router.post("/", (req, res) => {
  res
    .status(501)
    .json({ message: "Create collection endpoint - not implemented yet" });
});

router.put("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Update collection endpoint - not implemented yet" });
});

router.delete("/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Delete collection endpoint - not implemented yet" });
});

// Collection books management
router.post("/:id/books", (req, res) => {
  res
    .status(501)
    .json({ message: "Add book to collection endpoint - not implemented yet" });
});

router.delete("/:id/books/:bookId", (req, res) => {
  res.status(501).json({
    message: "Remove book from collection endpoint - not implemented yet",
  });
});

module.exports = router;
