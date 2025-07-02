const request = require("supertest");
const app = require("../app");

describe("Auth Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        favoriteGenres: ["Fiction", "Mystery"],
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("username", "testuser");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should return 400 for duplicate username", async () => {
      const duplicateUser = {
        username: "testuser",
        email: "different@example.com",
        password: "password123",
        favoriteGenres: ["Fiction"],
      };

      await request(app)
        .post("/api/auth/register")
        .send(duplicateUser)
        .expect(400);
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteUser = {
        username: "testuser2",
        email: "test2@example.com",
        // missing password
      };

      await request(app)
        .post("/api/auth/register")
        .send(incompleteUser)
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const loginData = {
        username: "testuser",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("username", "testuser");
    });

    it("should return 401 for invalid credentials", async () => {
      const invalidLogin = {
        username: "testuser",
        password: "wrongpassword",
      };

      await request(app).post("/api/auth/login").send(invalidLogin).expect(401);
    });
  });
});
