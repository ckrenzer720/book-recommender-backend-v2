const request = require("supertest");
const app = require("../app");

describe("Reviews Endpoints", () => {
  let authToken;
  let userId;
  let bookId;

  beforeAll(async () => {
    // Register and login a user for testing
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        username: "reviewuser",
        email: "review@example.com",
        password: "password123",
        favoriteGenres: ["Fiction"],
      });

    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "reviewuser",
      password: "password123",
    });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;

    // Get a book ID for testing
    const booksResponse = await request(app).get("/api/books");

    if (booksResponse.body.length > 0) {
      bookId = booksResponse.body[0].id;
    }
  });

  describe("POST /api/reviews", () => {
    it("should create a new review successfully", async () => {
      if (!bookId) {
        console.log("Skipping test - no books available");
        return;
      }

      const newReview = {
        bookId: bookId,
        rating: 5,
        review: "Great book! Highly recommended.",
      };

      const response = await request(app)
        .post("/api/reviews")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newReview)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "Review created successfully"
      );
      expect(response.body).toHaveProperty("review");
      expect(response.body.review).toHaveProperty("id");
      expect(response.body.review).toHaveProperty("bookId", bookId);
      expect(response.body.review).toHaveProperty("userId", userId);
      expect(response.body.review).toHaveProperty("rating", 5);
      expect(response.body.review).toHaveProperty(
        "review",
        "Great book! Highly recommended."
      );
    });

    it("should return 401 without authentication", async () => {
      const newReview = {
        bookId: bookId,
        rating: 4,
        review: "Good book",
      };

      await request(app).post("/api/reviews").send(newReview).expect(401);
    });

    it("should return 400 for invalid rating", async () => {
      const invalidReview = {
        bookId: bookId,
        rating: 6, // Invalid rating (should be 1-5)
        review: "Test review",
      };

      await request(app)
        .post("/api/reviews")
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidReview)
        .expect(400);
    });
  });

  describe("GET /api/reviews/book/:bookId", () => {
    it("should return reviews for a specific book", async () => {
      if (!bookId) {
        console.log("Skipping test - no books available");
        return;
      }

      const response = await request(app)
        .get(`/api/reviews/book/${bookId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const review = response.body[0];
        expect(review).toHaveProperty("id");
        expect(review).toHaveProperty("bookId", bookId);
        expect(review).toHaveProperty("rating");
        expect(review).toHaveProperty("review");
        expect(review).toHaveProperty("createdAt");
      }
    });

    it("should return 404 for non-existent book", async () => {
      await request(app).get("/api/reviews/book/99999").expect(404);
    });
  });

  describe("GET /api/reviews/user/:userId", () => {
    it("should return reviews by a specific user", async () => {
      const response = await request(app)
        .get(`/api/reviews/user/${userId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const review = response.body[0];
        expect(review).toHaveProperty("id");
        expect(review).toHaveProperty("userId", userId);
        expect(review).toHaveProperty("rating");
        expect(review).toHaveProperty("review");
      }
    });
  });
});
