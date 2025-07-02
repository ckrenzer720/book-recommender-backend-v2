const request = require("supertest");
const app = require("../app");

describe("Basic API Tests", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty(
        "message",
        "Book Recommender API is running"
      );
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/books", () => {
    it("should return books list", async () => {
      const response = await request(app).get("/api/books").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("404 handler", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/nonexistent").expect(404);

      expect(response.body).toHaveProperty("error", "Route not found");
    });
  });
});
