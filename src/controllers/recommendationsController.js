const Book = require("../models/Book");
const Review = require("../models/Review");
const User = require("../models/User");

// Get general recommendations
const getRecommendations = async (req, res) => {
  try {
    const { limit = 10, genre } = req.query;

    let recommendations = [];

    if (genre) {
      recommendations = await Book.findByGenre(genre, parseInt(limit));
    } else {
      recommendations = await Book.getTopRated(parseInt(limit));
    }

    // Add user information to books
    const recommendationsWithUser = await Promise.all(
      recommendations.map(async (book) => {
        const user = await User.findById(book.added_by);
        return {
          ...book,
          addedBy: user ? { id: user.id, username: user.username } : null,
        };
      })
    );

    res.json({
      success: true,
      data: { recommendations: recommendationsWithUser },
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
    const userReviews = await Review.findWithBook(userId);

    const userGenres = [...new Set(userReviews.map((review) => review.genre))];

    // Note: We'll need to implement user preferences in the User model
    // For now, we'll use the genres from reviews
    const preferredGenres = userGenres;

    // Get recommendations based on user's preferences
    let recommendations = [];

    if (preferredGenres.length > 0) {
      // Get books from preferred genres with good ratings
      for (const genre of preferredGenres) {
        const genreBooks = await Book.findByGenre(genre, parseInt(limit));
        recommendations = [...recommendations, ...genreBooks];
      }

      // Sort by rating and remove duplicates
      recommendations = recommendations
        .filter((book) => book.average_rating >= 3.5 && book.total_ratings >= 5)
        .sort((a, b) => b.average_rating - a.average_rating)
        .slice(0, parseInt(limit));
    }

    // If not enough recommendations, add popular books
    if (recommendations.length < limit) {
      const additionalBooks = await Book.getTopRated(
        parseInt(limit) - recommendations.length
      );
      const existingIds = recommendations.map((book) => book.id);
      const newBooks = additionalBooks.filter(
        (book) => !existingIds.includes(book.id)
      );
      recommendations = [...recommendations, ...newBooks];
    }

    // Add user information to books
    const recommendationsWithUser = await Promise.all(
      recommendations.map(async (book) => {
        const user = await User.findById(book.added_by);
        return {
          ...book,
          addedBy: user ? { id: user.id, username: user.username } : null,
        };
      })
    );

    res.json({
      success: true,
      data: { recommendations: recommendationsWithUser },
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
    // For now, we'll search by genre and author
    const similarBooks = await Book.search(targetBook.genre, parseInt(limit));

    // Filter out the target book and add author search
    const filteredBooks = similarBooks.filter(
      (book) => book.id !== parseInt(bookId) && book.average_rating >= 3.0
    );

    // Add user information to books
    const similarBooksWithUser = await Promise.all(
      filteredBooks.map(async (book) => {
        const user = await User.findById(book.added_by);
        return {
          ...book,
          addedBy: user ? { id: user.id, username: user.username } : null,
        };
      })
    );

    res.json({
      success: true,
      data: {
        targetBook: Book.getSummary(targetBook),
        similarBooks: similarBooksWithUser,
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
    const userReviews = await Review.findWithBook(userId);

    if (userReviews.length === 0) {
      // If no reading history, return popular books
      const popularBooks = await Book.getTopRated(parseInt(limit));

      // Add user information to books
      const popularBooksWithUser = await Promise.all(
        popularBooks.map(async (book) => {
          const user = await User.findById(book.added_by);
          return {
            ...book,
            addedBy: user ? { id: user.id, username: user.username } : null,
          };
        })
      );

      return res.json({
        success: true,
        data: {
          recommendations: popularBooksWithUser,
          message: "No reading history found. Showing popular books.",
        },
      });
    }

    // Analyze user's preferences
    const genreCounts = {};
    const authorCounts = {};

    userReviews.forEach((review) => {
      // Count genres
      genreCounts[review.genre] = (genreCounts[review.genre] || 0) + 1;

      // Count authors
      authorCounts[review.author] = (authorCounts[review.author] || 0) + 1;
    });

    // Get top preferences
    const topGenres = Object.keys(genreCounts)
      .sort((a, b) => genreCounts[b] - genreCounts[a])
      .slice(0, 3);

    const topAuthors = Object.keys(authorCounts)
      .sort((a, b) => authorCounts[b] - authorCounts[a])
      .slice(0, 2);

    // Find books that match user's preferences
    let recommendedBooks = [];
    const reviewedBookIds = userReviews.map((review) => review.book_id);

    for (const genre of topGenres) {
      const genreBooks = await Book.findByGenre(genre, parseInt(limit));
      recommendedBooks = [...recommendedBooks, ...genreBooks];
    }

    // Filter out already reviewed books and sort by rating
    recommendedBooks = recommendedBooks
      .filter(
        (book) =>
          !reviewedBookIds.includes(book.id) && book.average_rating >= 3.5
      )
      .sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, parseInt(limit));

    // Add user information to books
    const recommendedBooksWithUser = await Promise.all(
      recommendedBooks.map(async (book) => {
        const user = await User.findById(book.added_by);
        return {
          ...book,
          addedBy: user ? { id: user.id, username: user.username } : null,
        };
      })
    );

    res.json({
      success: true,
      data: {
        recommendations: recommendedBooksWithUser,
        userPreferences: {
          topGenres,
          topAuthors,
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
