const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 2000,
      default: "",
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "fiction",
        "non-fiction",
        "mystery",
        "romance",
        "sci-fi",
        "fantasy",
        "biography",
        "history",
        "self-help",
        "thriller",
        "horror",
        "poetry",
        "drama",
        "comedy",
        "other",
      ],
    },
    subGenre: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    publicationYear: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear(),
    },
    publisher: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    pageCount: {
      type: Number,
      min: 1,
    },
    language: {
      type: String,
      default: "English",
      trim: true,
    },
    coverImage: {
      type: String,
      default: null,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
bookSchema.index({ title: "text", author: "text", description: "text" });

// Method to update average rating
bookSchema.methods.updateAverageRating = function () {
  // This will be implemented when we add the Review model
  // For now, it's a placeholder
};

// Method to get book summary
bookSchema.methods.getSummary = function () {
  return {
    id: this._id,
    title: this.title,
    author: this.author,
    genre: this.genre,
    averageRating: this.averageRating,
    totalRatings: this.totalRatings,
    coverImage: this.coverImage,
  };
};

module.exports = mongoose.model("Book", bookSchema);
