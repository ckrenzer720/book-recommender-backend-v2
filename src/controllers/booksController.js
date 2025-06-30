const Book = require("../models/Book");
const User = require("../models/User");

// Get all books with pagination and filtering
const getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      genre,
      search,
      sortBy = "title",
      sortOrder = "asc",
    } = req.query;

    const offset = (page - 1) * limit;
    let books = [];
    let total = 0;

    if (search) {
      books = await Book.search(search, parseInt(limit), offset);
      total = await Book.count();
    } else if (genre) {
      books = await Book.findByGenre(genre, parseInt(limit), offset);
      total = await Book.countByGenre(genre);
    } else {
      books = await Book.findAll(parseInt(limit), offset);
      total = await Book.count();
    }

    // Add user information to books
    const booksWithUser = await Promise.all(
      books.map(async (book) => {
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
        books: booksWithUser,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all books error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Get user information
    const user = await User.findById(book.added_by);
    const bookWithUser = {
      ...book,
      addedBy: user ? { id: user.id, username: user.username } : null,
    };

    res.json({
      success: true,
      data: { book: bookWithUser },
    });
  } catch (error) {
    console.error("Get book by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create new book
const createBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      added_by: req.userId, // From auth middleware
    };

    const book = await Book.create(bookData);

    // Get user information
    const user = await User.findById(book.added_by);
    const bookWithUser = {
      ...book,
      addedBy: user ? { id: user.id, username: user.username } : null,
    };

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: { book: bookWithUser },
    });
  } catch (error) {
    console.error("Create book error:", error);

    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({
        success: false,
        message: "Validation error - ISBN already exists",
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

// Update book
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if user is authorized to update this book
    if (book.added_by !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book",
      });
    }

    const updatedBook = await Book.updateById(id, updateData);

    // Get user information
    const user = await User.findById(updatedBook.added_by);
    const bookWithUser = {
      ...updatedBook,
      addedBy: user ? { id: user.id, username: user.username } : null,
    };

    res.json({
      success: true,
      message: "Book updated successfully",
      data: { book: bookWithUser },
    });
  } catch (error) {
    console.error("Update book error:", error);

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

// Delete book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if user is authorized to delete this book
    if (book.added_by !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this book",
      });
    }

    await Book.deleteById(id);

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { q, genre, author, limit = 10 } = req.query;

    let books = [];

    if (q) {
      books = await Book.search(q, parseInt(limit));
    } else if (genre) {
      books = await Book.findByGenre(genre, parseInt(limit));
    } else if (author) {
      // For author search, we'll need to implement this in the Book model
      books = await Book.search(author, parseInt(limit));
    } else {
      books = await Book.findAll(parseInt(limit));
    }

    // Add user information to books
    const booksWithUser = await Promise.all(
      books.map(async (book) => {
        const user = await User.findById(book.added_by);
        return {
          ...book,
          addedBy: user ? { id: user.id, username: user.username } : null,
        };
      })
    );

    res.json({
      success: true,
      data: { books: booksWithUser },
    });
  } catch (error) {
    console.error("Search books error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
};
