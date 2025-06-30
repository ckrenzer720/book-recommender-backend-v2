const Collection = require("../models/Collection");
const Book = require("../models/Book");
const User = require("../models/User");

// Get user collections
const getUserCollections = async (req, res) => {
  try {
    const { page = 1, limit = 10, isPublic } = req.query;

    const offset = (page - 1) * limit;
    let collections = [];
    let total = 0;

    if (isPublic !== undefined) {
      // Filter by public status
      collections = await Collection.findByUser(
        req.userId,
        parseInt(limit),
        offset
      );
      total = await Collection.countByUser(req.userId);
    } else {
      collections = await Collection.findByUser(
        req.userId,
        parseInt(limit),
        offset
      );
      total = await Collection.countByUser(req.userId);
    }

    // Add books to each collection
    const collectionsWithBooks = await Promise.all(
      collections.map(async (collection) => {
        const books = await Collection.getBooks(collection.id, 5, 0); // Get first 5 books
        return {
          ...collection,
          books: books.map((book) => ({
            book: {
              id: book.book_id,
              title: book.title,
              author: book.author,
              cover_image: book.cover_image,
              average_rating: book.average_rating,
            },
            added_at: book.added_at,
            notes: book.notes,
          })),
        };
      })
    );

    res.json({
      success: true,
      data: {
        collections: collectionsWithBooks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCollections: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get user collections error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get collection by ID
const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // Check if user can access this collection
    if (!collection.is_public && collection.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this collection",
      });
    }

    // Get user information
    const user = await User.findById(collection.user_id);

    // Get books in collection
    const books = await Collection.getBooks(collection.id);

    const collectionWithDetails = {
      ...collection,
      user: user ? { id: user.id, username: user.username } : null,
      books: books.map((book) => ({
        book: {
          id: book.book_id,
          title: book.title,
          author: book.author,
          cover_image: book.cover_image,
          average_rating: book.average_rating,
          total_ratings: book.total_ratings,
          genre: book.genre,
        },
        added_at: book.added_at,
        notes: book.notes,
      })),
    };

    res.json({
      success: true,
      data: { collection: collectionWithDetails },
    });
  } catch (error) {
    console.error("Get collection by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create new collection
const createCollection = async (req, res) => {
  try {
    const { name, description, isPublic, coverImage, tags } = req.body;

    const collection = await Collection.create({
      name,
      description,
      user_id: req.userId,
      is_public: isPublic !== undefined ? isPublic : true,
      cover_image: coverImage,
    });

    // Add tags if provided
    if (tags && tags.length > 0) {
      await Collection.addTags(collection.id, tags);
    }

    // Get user information
    const user = await User.findById(collection.user_id);
    const collectionWithUser = {
      ...collection,
      user: user ? { id: user.id, username: user.username } : null,
    };

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: { collection: collectionWithUser },
    });
  } catch (error) {
    console.error("Create collection error:", error);

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

// Update collection
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // Check if user is authorized to update this collection
    if (collection.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this collection",
      });
    }

    const updatedCollection = await Collection.updateById(id, updateData);

    // Get user information
    const user = await User.findById(updatedCollection.user_id);
    const collectionWithUser = {
      ...updatedCollection,
      user: user ? { id: user.id, username: user.username } : null,
    };

    res.json({
      success: true,
      message: "Collection updated successfully",
      data: { collection: collectionWithUser },
    });
  } catch (error) {
    console.error("Update collection error:", error);

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

// Delete collection
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // Check if user is authorized to delete this collection
    if (collection.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this collection",
      });
    }

    await Collection.deleteById(id);

    res.json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Delete collection error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add book to collection
const addBookToCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookId, notes } = req.body;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // Check if user is authorized to modify this collection
    if (collection.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this collection",
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

    await Collection.addBook(id, bookId, notes);

    // Get updated collection with books
    const books = await Collection.getBooks(id);
    const user = await User.findById(collection.user_id);

    const updatedCollection = {
      ...collection,
      user: user ? { id: user.id, username: user.username } : null,
      books: books.map((book) => ({
        book: {
          id: book.book_id,
          title: book.title,
          author: book.author,
          cover_image: book.cover_image,
          average_rating: book.average_rating,
        },
        added_at: book.added_at,
        notes: book.notes,
      })),
    };

    res.json({
      success: true,
      message: "Book added to collection successfully",
      data: { collection: updatedCollection },
    });
  } catch (error) {
    console.error("Add book to collection error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Remove book from collection
const removeBookFromCollection = async (req, res) => {
  try {
    const { id, bookId } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // Check if user is authorized to modify this collection
    if (collection.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this collection",
      });
    }

    await Collection.removeBook(id, bookId);

    // Get updated collection with books
    const books = await Collection.getBooks(id);
    const user = await User.findById(collection.user_id);

    const updatedCollection = {
      ...collection,
      user: user ? { id: user.id, username: user.username } : null,
      books: books.map((book) => ({
        book: {
          id: book.book_id,
          title: book.title,
          author: book.author,
          cover_image: book.cover_image,
          average_rating: book.average_rating,
        },
        added_at: book.added_at,
        notes: book.notes,
      })),
    };

    res.json({
      success: true,
      message: "Book removed from collection successfully",
      data: { collection: updatedCollection },
    });
  } catch (error) {
    console.error("Remove book from collection error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getUserCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addBookToCollection,
  removeBookFromCollection,
};
