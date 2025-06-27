const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          trim: true,
          maxlength: 200,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    coverImage: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    totalBooks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user collections
collectionSchema.index({ user: 1, name: 1 });

// Method to add book to collection
collectionSchema.methods.addBook = function (bookId, notes = "") {
  const existingBook = this.books.find(
    (item) => item.book.toString() === bookId.toString()
  );

  if (!existingBook) {
    this.books.push({
      book: bookId,
      notes: notes,
    });
    this.totalBooks = this.books.length;
  }

  return this.save();
};

// Method to remove book from collection
collectionSchema.methods.removeBook = function (bookId) {
  this.books = this.books.filter(
    (item) => item.book.toString() !== bookId.toString()
  );
  this.totalBooks = this.books.length;
  return this.save();
};

// Method to get collection summary
collectionSchema.methods.getSummary = function () {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    isPublic: this.isPublic,
    coverImage: this.coverImage,
    totalBooks: this.totalBooks,
    tags: this.tags,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Collection", collectionSchema);
