const Review = require("../models/Review");
const Book = require("../models/Book");

// Get all reviews with pagination
const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const offset = (page - 1) * limit;

    const reviews = await Review.findWithUser(null, parseInt(limit), offset);
    const total = await Review.countByBook(null);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get reviews for a specific book
const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const offset = (page - 1) * limit;

    const reviews = await Review.findWithUser(bookId, parseInt(limit), offset);
    const total = await Review.countByBook(bookId);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get reviews by book error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get reviews by a specific user
const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const offset = (page - 1) * limit;

    const reviews = await Review.findWithBook(userId, parseInt(limit), offset);
    const total = await Review.countByUser(userId);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get reviews by user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { bookId, rating, title, comment, readingStatus, dateRead } =
      req.body;

    // Check if user already reviewed this book
    const existingReview = await Review.findByUserAndBook(req.userId, bookId);

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const review = await Review.create({
      user_id: req.userId,
      book_id: bookId,
      rating,
      title,
      comment,
      reading_status: readingStatus,
      date_read: dateRead,
    });

    // Update book's average rating
    const avgRatingData = await Review.getAverageRating(bookId);
    await Book.updateAverageRating(
      bookId,
      avgRatingData.average_rating,
      avgRatingData.total_reviews
    );

    // Get review with user and book information
    const [reviewWithDetails] = await Review.findWithUser(bookId, 1, 0);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: { review: reviewWithDetails },
    });
  } catch (error) {
    console.error("Create review error:", error);

    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user is authorized to update this review
    if (review.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    const updatedReview = await Review.updateById(id, updateData);

    // Update book's average rating
    const avgRatingData = await Review.getAverageRating(review.book_id);
    await Book.updateAverageRating(
      review.book_id,
      avgRatingData.average_rating,
      avgRatingData.total_reviews
    );

    // Get updated review with user and book information
    const [reviewWithDetails] = await Review.findWithUser(review.book_id, 1, 0);

    res.json({
      success: true,
      message: "Review updated successfully",
      data: { review: reviewWithDetails },
    });
  } catch (error) {
    console.error("Update review error:", error);

    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user is authorized to delete this review
    if (review.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const bookId = review.book_id;
    await Review.deleteById(id);

    // Update book's average rating
    const avgRatingData = await Review.getAverageRating(bookId);
    await Book.updateAverageRating(
      bookId,
      avgRatingData.average_rating,
      avgRatingData.total_reviews
    );

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewsByBook,
  getReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
};
