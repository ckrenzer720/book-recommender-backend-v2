const express = require("express");
const router = express.Router();

const reviewsController = require("../../controllers/reviewsController");

// TODO: Import reviews controller
// const reviewsController = require('../../controllers/reviewsController');

// Reviews routes
router.get("/", reviewsController.getAllReviews);

router.get("/book/:bookId", reviewsController.getReviewsByBook);

router.get("/user/:userId", reviewsController.getReviewsByUser);

router.post("/", reviewsController.createReview);

router.put("/:id", reviewsController.updateReview);

router.delete("/:id", reviewsController.deleteReview);

module.exports = router;
