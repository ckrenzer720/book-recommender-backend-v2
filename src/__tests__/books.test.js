process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");

describe("Books Endpoints", () => {
  describe("GET /api/books", () => {
    it("should return a list of books", async () => {
      const response = await request(app).get("/api/books").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      if (response.body.length > 0) {
        const book = response.body[0];
        expect(book).toHaveProperty("id");
        expect(book).toHaveProperty("title");
        expect(book).toHaveProperty("author");
        expect(book).toHaveProperty("isbn");
      }
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/books?page=1&limit=5")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });

  describe("GET /api/books/:id", () => {
    it("should return a specific book by ID", async () => {
      // First get a list of books to get an ID
      const booksResponse = await request(app).get("/api/books").expect(200);

      if (booksResponse.body.length > 0) {
        const bookId = booksResponse.body[0].id;

        const response = await request(app)
          .get(`/api/books/${bookId}`)
          .expect(200);

        expect(response.body).toHaveProperty("id", bookId);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("author");
        expect(response.body).toHaveProperty("isbn");
      }
    });

    it("should return 404 for non-existent book", async () => {
      await request(app).get("/api/books/99999").expect(404);
    });
  });

  describe("GET /api/books/search", () => {
    it("should search books by title", async () => {
      const response = await request(app)
        .get("/api/books/search?q=harry")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should search books by author", async () => {
      const response = await request(app)
        .get("/api/books/search?q=rowling")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return empty array for no matches", async () => {
      const response = await request(app)
        .get("/api/books/search?q=nonexistentbooktitle")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });
});
