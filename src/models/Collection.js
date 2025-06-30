const db = require("../database/connection");

class Collection {
  static tableName = "collections";

  // Create a new collection
  static async create(collectionData) {
    const [collection] = await db(this.tableName)
      .insert({
        ...collectionData,
        total_books: 0,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return collection;
  }

  // Find collection by ID
  static async findById(id) {
    const [collection] = await db(this.tableName).where({ id }).select("*");

    return collection;
  }

  // Find collections by user
  static async findByUser(userId, limit = 20, offset = 0) {
    return await db(this.tableName)
      .where({ user_id: userId })
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Find public collections
  static async findPublic(limit = 20, offset = 0) {
    return await db(this.tableName)
      .where({ is_public: true })
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Update collection
  static async updateById(id, updateData) {
    const [collection] = await db(this.tableName)
      .where({ id })
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .returning("*");

    return collection;
  }

  // Delete collection
  static async deleteById(id) {
    return await db(this.tableName).where({ id }).del();
  }

  // Add book to collection
  static async addBook(collectionId, bookId, notes = "") {
    // Check if book is already in collection
    const existingBook = await db("collection_books")
      .where({ collection_id: collectionId, book_id: bookId })
      .first();

    if (existingBook) {
      return existingBook;
    }

    // Add book to collection
    const [collectionBook] = await db("collection_books")
      .insert({
        collection_id: collectionId,
        book_id: bookId,
        notes,
        added_at: new Date(),
      })
      .returning("*");

    // Update collection total books count
    await this.updateTotalBooks(collectionId);

    return collectionBook;
  }

  // Remove book from collection
  static async removeBook(collectionId, bookId) {
    const result = await db("collection_books")
      .where({ collection_id: collectionId, book_id: bookId })
      .del();

    if (result > 0) {
      // Update collection total books count
      await this.updateTotalBooks(collectionId);
    }

    return result > 0;
  }

  // Update total books count for a collection
  static async updateTotalBooks(collectionId) {
    const [result] = await db("collection_books")
      .where({ collection_id: collectionId })
      .count("* as total");

    await db(this.tableName).where({ id: collectionId }).update({
      total_books: result.total,
      updated_at: new Date(),
    });
  }

  // Get books in a collection
  static async getBooks(collectionId, limit = 20, offset = 0) {
    return await db("collection_books")
      .join("books", "collection_books.book_id", "books.id")
      .where({ collection_id: collectionId })
      .select(
        "collection_books.*",
        "books.title",
        "books.author",
        "books.cover_image",
        "books.genre",
        "books.average_rating"
      )
      .orderBy("collection_books.added_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Get collection summary
  static getSummary(collection) {
    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      is_public: collection.is_public,
      cover_image: collection.cover_image,
      total_books: collection.total_books,
      created_at: collection.created_at,
      updated_at: collection.updated_at,
    };
  }

  // Search collections
  static async search(query, limit = 20, offset = 0) {
    return await db(this.tableName)
      .where("name", "like", `%${query}%`)
      .orWhere("description", "like", `%${query}%`)
      .andWhere({ is_public: true })
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Get collections with user information
  static async findWithUser(userId, limit = 20, offset = 0) {
    return await db(this.tableName)
      .join("users", "collections.user_id", "users.id")
      .where({ "collections.user_id": userId })
      .select(
        "collections.*",
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.profile_picture"
      )
      .orderBy("collections.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  // Count collections by user
  static async countByUser(userId) {
    const [result] = await db(this.tableName)
      .where({ user_id: userId })
      .count("* as total");
    return result.total;
  }

  // Get collection tags
  static async getTags(collectionId) {
    return await db("collection_tags")
      .where({ collection_id: collectionId })
      .select("tag");
  }

  // Add tags to collection
  static async addTags(collectionId, tags) {
    const tagData = tags.map((tag) => ({
      collection_id: collectionId,
      tag: tag.trim(),
    }));

    return await db("collection_tags").insert(tagData);
  }

  // Remove tags from collection
  static async removeTags(collectionId, tags) {
    return await db("collection_tags")
      .where({ collection_id: collectionId })
      .whereIn("tag", tags)
      .del();
  }

  // Find collections by tag
  static async findByTag(tag, limit = 20, offset = 0) {
    return await db(this.tableName)
      .join(
        "collection_tags",
        "collections.id",
        "collection_tags.collection_id"
      )
      .where({ tag, is_public: true })
      .select("collections.*")
      .orderBy("collections.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }
}

module.exports = Collection;
