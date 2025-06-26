const express = require("express");
const router = express.Router();

// TODO: Import recommendations controller
// const recommendationsController = require('../../controllers/recommendationsController');

// Recommendations routes
router.get("/", (req, res) => {
  res
    .status(501)
    .json({ message: "Get recommendations endpoint - not implemented yet" });
});

router.get("/user/:userId", (req, res) => {
  res.status(501).json({
    message: "Get user recommendations endpoint - not implemented yet",
  });
});

router.get("/book/:bookId", (req, res) => {
  res
    .status(501)
    .json({ message: "Get similar books endpoint - not implemented yet" });
});

router.post("/generate", (req, res) => {
  res.status(501).json({
    message: "Generate recommendations endpoint - not implemented yet",
  });
});

module.exports = router;
