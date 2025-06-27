const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    notHelpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    readingStatus: {
      type: String,
      enum: ["want-to-read", "currently-reading", "finished", "abandoned"],
      default: "finished",
    },
    dateRead: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per book
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

// Method to get review summary
reviewSchema.methods.getSummary = function () {
  return {
    id: this._id,
    rating: this.rating,
    title: this.title,
    comment: this.comment,
    helpfulVotes: this.helpfulVotes,
    notHelpfulVotes: this.notHelpfulVotes,
    readingStatus: this.readingStatus,
    dateRead: this.dateRead,
    createdAt: this.createdAt,
    user: this.user,
  };
};

// Static method to get average rating for a book
reviewSchema.statics.getAverageRating = async function (bookId) {
  const result = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0
    ? {
        averageRating: Math.round(result[0].avgRating * 10) / 10,
        totalReviews: result[0].totalReviews,
      }
    : { averageRating: 0, totalReviews: 0 };
};

module.exports = mongoose.model("Review", reviewSchema);
