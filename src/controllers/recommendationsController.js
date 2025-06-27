const Book = require("../models/Book");
const Review = require("../models/Review");
const User = require("../models/User");

// Get general recommendations
const getRecommendations = async (req, res) => {
  try {
    const { limit = 10, genre } = req.query;

    const filter = {};
    if (genre) filter.genre = genre;

    // Get top-rated books
    const recommendations = await Book.find(filter)
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(parseInt(limit))
      .populate("addedBy", "username");

    res.json({
      success: true,
      data: { recommendations },
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get personalized recommendations for a user
const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    // Get user's reading preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's reviewed books and their genres
    const userReviews = await Review.find({ user: userId }).populate(
      "book",
      "genre averageRating"
    );

    const userGenres = [
      ...new Set(userReviews.map((review) => review.book.genre)),
    ];
    const userPreferences = user.preferences?.favoriteGenres || [];

    // Combine user's reviewed genres with preferences
    const preferredGenres = [...new Set([...userGenres, ...userPreferences])];

    // Get recommendations based on user's preferences
    let recommendations = [];

    if (preferredGenres.length > 0) {
      recommendations = await Book.find({
        genre: { $in: preferredGenres },
        averageRating: { $gte: 3.5 },
        totalRatings: { $gte: 5 },
      })
        .sort({ averageRating: -1, totalRatings: -1 })
        .limit(parseInt(limit))
        .populate("addedBy", "username");
    }

    // If not enough recommendations, add popular books
    if (recommendations.length < limit) {
      const additionalBooks = await Book.find({
        _id: { $nin: recommendations.map((book) => book._id) },
        averageRating: { $gte: 4.0 },
        totalRatings: { $gte: 10 },
      })
        .sort({ averageRating: -1, totalRatings: -1 })
        .limit(parseInt(limit) - recommendations.length)
        .populate("addedBy", "username");

      recommendations = [...recommendations, ...additionalBooks];
    }

    res.json({
      success: true,
      data: { recommendations },
    });
  } catch (error) {
    console.error("Get user recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get similar books based on a specific book
const getSimilarBooks = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { limit = 10 } = req.query;

    // Get the target book
    const targetBook = await Book.findById(bookId);
    if (!targetBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Find books with similar characteristics
    const similarBooks = await Book.find({
      _id: { $ne: bookId },
      $or: [
        { genre: targetBook.genre },
        { author: targetBook.author },
        { tags: { $in: targetBook.tags } },
      ],
      averageRating: { $gte: 3.0 },
    })
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(parseInt(limit))
      .populate("addedBy", "username");

    res.json({
      success: true,
      data: {
        targetBook: targetBook.getSummary(),
        similarBooks,
      },
    });
  } catch (error) {
    console.error("Get similar books error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Generate recommendations based on user's reading history
const generateRecommendations = async (req, res) => {
  try {
    const { userId } = req.body;
    const { limit = 10 } = req.query;

    // Get user's reading history
    const userReviews = await Review.find({ user: userId }).populate(
      "book",
      "genre author tags averageRating"
    );

    if (userReviews.length === 0) {
      // If no reading history, return popular books
      const popularBooks = await Book.find()
        .sort({ averageRating: -1, totalRatings: -1 })
        .limit(parseInt(limit))
        .populate("addedBy", "username");

      return res.json({
        success: true,
        data: {
          recommendations: popularBooks,
          message: "No reading history found. Showing popular books.",
        },
      });
    }

    // Analyze user's preferences
    const genreCounts = {};
    const authorCounts = {};
    const tagCounts = {};

    userReviews.forEach((review) => {
      const book = review.book;

      // Count genres
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;

      // Count authors
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;

      // Count tags
      book.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Get top preferences
    const topGenres = Object.keys(genreCounts)
      .sort((a, b) => genreCounts[b] - genreCounts[a])
      .slice(0, 3);

    const topAuthors = Object.keys(authorCounts)
      .sort((a, b) => authorCounts[b] - authorCounts[a])
      .slice(0, 2);

    const topTags = Object.keys(tagCounts)
      .sort((a, b) => tagCounts[b] - tagCounts[a])
      .slice(0, 5);

    // Find books that match user's preferences
    const recommendedBooks = await Book.find({
      _id: { $nin: userReviews.map((review) => review.book._id) },
      $or: [
        { genre: { $in: topGenres } },
        { author: { $in: topAuthors } },
        { tags: { $in: topTags } },
      ],
      averageRating: { $gte: 3.5 },
    })
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(parseInt(limit))
      .populate("addedBy", "username");

    res.json({
      success: true,
      data: {
        recommendations: recommendedBooks,
        userPreferences: {
          topGenres,
          topAuthors,
          topTags,
        },
      },
    });
  } catch (error) {
    console.error("Generate recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
  getUserRecommendations,
  getSimilarBooks,
  generateRecommendations,
};
