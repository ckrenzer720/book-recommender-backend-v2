const db = require("../database/connection");

class Review {
  static tableName = "reviews";

  // Create a new review
  static async create(reviewData) {
    const [review] = await db(this.tableName)
      .insert({
        ...reviewData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return review;
  }

  // Find review by ID
  static async findById(id) {
    const [review] = await db(this.tableName).where({ id }).select("*");

    return review;
  }

  // Find review by user and book
  static async findByUserAndBook(userId, bookId) {
    const [review] = await db(this.tableName)
      .where({ user_id: userId, book_id: bookId })
      .select("*");

    return review;
  }

  // Find all reviews for a book
  static async findByBook(bookId, limit = 20, offset = 0) {
    return await db(this.tableName)
      .where({ book_id: bookId })
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Find all reviews by a user
  static async findByUser(userId, limit = 20, offset = 0) {
    return await db(this.tableName)
      .where({ user_id: userId })
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Update review
  static async updateById(id, updateData) {
    const [review] = await db(this.tableName)
      .where({ id })
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .returning("*");

    return review;
  }

  // Delete review
  static async deleteById(id) {
    return await db(this.tableName).where({ id }).del();
  }

  // Get average rating for a book
  static async getAverageRating(bookId) {
    const [result] = await db(this.tableName)
      .where({ book_id: bookId })
      .select(
        db.raw("AVG(rating) as avg_rating"),
        db.raw("COUNT(*) as total_reviews")
      );

    return {
      average_rating: result.avg_rating
        ? Math.round(result.avg_rating * 10) / 10
        : 0,
      total_reviews: parseInt(result.total_reviews) || 0,
    };
  }

  // Get review summary
  static getSummary(review) {
    return {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      helpful_votes: review.helpful_votes,
      not_helpful_votes: review.not_helpful_votes,
      reading_status: review.reading_status,
      date_read: review.date_read,
      created_at: review.created_at,
      user_id: review.user_id,
    };
  }

  // Get reviews with user information
  static async findWithUser(bookId, limit = 20, offset = 0) {
    return await db(this.tableName)
      .join("users", "reviews.user_id", "users.id")
      .where({ book_id: bookId })
      .select(
        "reviews.*",
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.profile_picture"
      )
      .orderBy("reviews.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Get reviews with book information
  static async findWithBook(userId, limit = 20, offset = 0) {
    return await db(this.tableName)
      .join("books", "reviews.book_id", "books.id")
      .where({ user_id: userId })
      .select(
        "reviews.*",
        "books.title",
        "books.author",
        "books.cover_image",
        "books.genre"
      )
      .orderBy("reviews.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Count reviews for a book
  static async countByBook(bookId) {
    const [result] = await db(this.tableName)
      .where({ book_id: bookId })
      .count("* as total");
    return result.total;
  }

  // Count reviews by a user
  static async countByUser(userId) {
    const [result] = await db(this.tableName)
      .where({ user_id: userId })
      .count("* as total");
    return result.total;
  }

  // Get reviews by reading status
  static async findByReadingStatus(userId, status, limit = 20, offset = 0) {
    return await db(this.tableName)
      .join("books", "reviews.book_id", "books.id")
      .where({ user_id: userId, reading_status: status })
      .select(
        "reviews.*",
        "books.title",
        "books.author",
        "books.cover_image",
        "books.genre"
      )
      .orderBy("reviews.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Update helpful votes
  static async updateHelpfulVotes(id, helpfulVotes, notHelpfulVotes) {
    const [review] = await db(this.tableName)
      .where({ id })
      .update({
        helpful_votes: helpfulVotes,
        not_helpful_votes: notHelpfulVotes,
        updated_at: new Date(),
      })
      .returning("*");

    return review;
  }
}

module.exports = Review;
