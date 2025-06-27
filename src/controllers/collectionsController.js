const Collection = require("../models/Collection");
const Book = require("../models/Book");

// Get user collections
const getUserCollections = async (req, res) => {
  try {
    const { page = 1, limit = 10, isPublic } = req.query;

    const filter = { user: req.userId };
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === "true";
    }

    const skip = (page - 1) * limit;

    const collections = await Collection.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("books.book", "title author coverImage averageRating");

    const total = await Collection.countDocuments(filter);

    res.json({
      success: true,
      data: {
        collections,
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

    const collection = await Collection.findById(id)
      .populate("user", "username")
      .populate(
        "books.book",
        "title author coverImage averageRating totalRatings genre"
      );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // Check if user can access this collection
    if (!collection.isPublic && collection.user._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this collection",
      });
    }

    res.json({
      success: true,
      data: { collection },
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

    const collection = new Collection({
      name,
      description,
      user: req.userId,
      isPublic: isPublic !== undefined ? isPublic : true,
      coverImage,
      tags,
    });

    await collection.save();

    const populatedCollection = await Collection.findById(
      collection._id
    ).populate("user", "username");

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: { collection: populatedCollection },
    });
  } catch (error) {
    console.error("Create collection error:", error);

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
    if (collection.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this collection",
      });
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("user", "username")
      .populate("books.book", "title author coverImage");

    res.json({
      success: true,
      message: "Collection updated successfully",
      data: { collection: updatedCollection },
    });
  } catch (error) {
    console.error("Update collection error:", error);

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
    if (collection.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this collection",
      });
    }

    await Collection.findByIdAndDelete(id);

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
    if (collection.user.toString() !== req.userId) {
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

    await collection.addBook(bookId, notes);

    const updatedCollection = await Collection.findById(id)
      .populate("user", "username")
      .populate("books.book", "title author coverImage averageRating");

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
    if (collection.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this collection",
      });
    }

    await collection.removeBook(bookId);

    const updatedCollection = await Collection.findById(id)
      .populate("user", "username")
      .populate("books.book", "title author coverImage averageRating");

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
