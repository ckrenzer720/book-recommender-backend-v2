const express = require("express");
const router = express.Router();

const recommendationsController = require("../../controllers/recommendationsController");

// TODO: Import recommendations controller
// const recommendationsController = require('../../controllers/recommendationsController');

// Recommendations routes
router.get("/", recommendationsController.getRecommendations);

router.get("/user/:userId", recommendationsController.getUserRecommendations);

router.get("/book/:bookId", recommendationsController.getSimilarBooks);

router.post("/generate", recommendationsController.generateRecommendations);

module.exports = router;
