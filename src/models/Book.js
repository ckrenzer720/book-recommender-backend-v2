const db = require("../database/connection");

class Book {
  static tableName = "books";

  // Create a new book
  static async create(bookData) {
    const [book] = await db(this.tableName)
      .insert({
        ...bookData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return book;
  }

  // Find book by ID
  static async findById(id) {
    const [book] = await db(this.tableName).where({ id }).select("*");

    return book;
  }

  // Find book by ISBN
  static async findByIsbn(isbn) {
    const [book] = await db(this.tableName).where({ isbn }).select("*");

    return book;
  }

  // Find all books with pagination
  static async findAll(limit = 20, offset = 0) {
    return await db(this.tableName)
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Find books by genre
  static async findByGenre(genre, limit = 20, offset = 0) {
    return await db(this.tableName)
      .where({ genre })
      .select("*")
      .orderBy("average_rating", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Search books by title, author, or description
  static async search(query, limit = 20, offset = 0) {
    return await db(this.tableName)
      .where("title", "like", `%${query}%`)
      .orWhere("author", "like", `%${query}%`)
      .orWhere("description", "like", `%${query}%`)
      .select("*")
      .orderBy("average_rating", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Update book
  static async updateById(id, updateData) {
    const [book] = await db(this.tableName)
      .where({ id })
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .returning("*");

    return book;
  }

  // Update average rating
  static async updateAverageRating(id, averageRating, totalRatings) {
    const [book] = await db(this.tableName)
      .where({ id })
      .update({
        average_rating: averageRating,
        total_ratings: totalRatings,
        updated_at: new Date(),
      })
      .returning("*");

    return book;
  }

  // Delete book
  static async deleteById(id) {
    return await db(this.tableName).where({ id }).del();
  }

  // Get books by user (books added by user)
  static async findByUser(userId, limit = 20, offset = 0) {
    return await db(this.tableName)
      .where({ added_by: userId })
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Get book summary
  static getSummary(book) {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      average_rating: book.average_rating,
      total_ratings: book.total_ratings,
      cover_image: book.cover_image,
    };
  }

  // Get top rated books
  static async getTopRated(limit = 10) {
    return await db(this.tableName)
      .where("average_rating", ">", 0)
      .select("*")
      .orderBy("average_rating", "desc")
      .limit(limit);
  }

  // Get recent books
  static async getRecent(limit = 10) {
    return await db(this.tableName)
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit);
  }

  // Count total books
  static async count() {
    const [result] = await db(this.tableName).count("* as total");
    return result.total;
  }

  // Count books by genre
  static async countByGenre(genre) {
    const [result] = await db(this.tableName)
      .where({ genre })
      .count("* as total");
    return result.total;
  }
}

module.exports = Book;
