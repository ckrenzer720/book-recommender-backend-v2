const Review = require("../models/Review");
const Book = require("../models/Book");

// Get all reviews with pagination
const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ isPublic: true })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("user", "username")
      .populate("book", "title author coverImage");

    const total = await Review.countDocuments({ isPublic: true });

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
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      book: bookId,
      isPublic: true,
    })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("user", "username");

    const total = await Review.countDocuments({
      book: bookId,
      isPublic: true,
    });

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
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      user: userId,
      isPublic: true,
    })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("book", "title author coverImage");

    const total = await Review.countDocuments({
      user: userId,
      isPublic: true,
    });

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
    const existingReview = await Review.findOne({
      user: req.userId,
      book: bookId,
    });

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

    const review = new Review({
      user: req.userId,
      book: bookId,
      rating,
      title,
      comment,
      readingStatus,
      dateRead,
    });

    await review.save();

    // Update book's average rating
    const avgRatingData = await Review.getAverageRating(bookId);
    await Book.findByIdAndUpdate(bookId, {
      averageRating: avgRatingData.averageRating,
      totalRatings: avgRatingData.totalReviews,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "username")
      .populate("book", "title author");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: { review: populatedReview },
    });
  } catch (error) {
    console.error("Create review error:", error);

    if (error.name === "ValidationError") {
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
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "username")
      .populate("book", "title author");

    // Update book's average rating
    const avgRatingData = await Review.getAverageRating(review.book);
    await Book.findByIdAndUpdate(review.book, {
      averageRating: avgRatingData.averageRating,
      totalRatings: avgRatingData.totalReviews,
    });

    res.json({
      success: true,
      message: "Review updated successfully",
      data: { review: updatedReview },
    });
  } catch (error) {
    console.error("Update review error:", error);

    if (error.name === "ValidationError") {
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
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const bookId = review.book;
    await Review.findByIdAndDelete(id);

    // Update book's average rating
    const avgRatingData = await Review.getAverageRating(bookId);
    await Book.findByIdAndUpdate(bookId, {
      averageRating: avgRatingData.averageRating,
      totalRatings: avgRatingData.totalReviews,
    });

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
