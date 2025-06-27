const Book = require("../models/Book");

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

    // Build filter object
    const filter = {};
    if (genre) filter.genre = genre;
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const books = await Book.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("addedBy", "username");

    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      data: {
        books,
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

    const book = await Book.findById(id).populate("addedBy", "username");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      data: { book },
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
      addedBy: req.userId, // From auth middleware
    };

    const book = new Book(bookData);
    await book.save();

    const populatedBook = await Book.findById(book._id).populate(
      "addedBy",
      "username"
    );

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: { book: populatedBook },
    });
  } catch (error) {
    console.error("Create book error:", error);

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
    if (book.addedBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("addedBy", "username");

    res.json({
      success: true,
      message: "Book updated successfully",
      data: { book: updatedBook },
    });
  } catch (error) {
    console.error("Update book error:", error);

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
    if (book.addedBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this book",
      });
    }

    await Book.findByIdAndDelete(id);

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

    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = { $regex: author, $options: "i" };
    if (q) {
      filter.$text = { $search: q };
    }

    const books = await Book.find(filter)
      .limit(parseInt(limit))
      .populate("addedBy", "username");

    res.json({
      success: true,
      data: { books },
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
