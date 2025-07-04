const db = require("../database/connection");
const bcrypt = require("bcryptjs");

class User {
  static tableName = "users";

  // Create a new user
  static async create(userData) {
    const { password, ...otherData } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user] = await db(this.tableName)
      .insert({
        ...otherData,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return user;
  }

  // Find user by email
  static async findByEmail(email) {
    if (!email) return null;

    const [user] = await db(this.tableName)
      .where({ email: email.toLowerCase() })
      .select("*");

    return user;
  }

  // Find user by username
  static async findByUsername(username) {
    const [user] = await db(this.tableName).where({ username }).select("*");

    return user;
  }

  // Find user by ID
  static async findById(id) {
    const [user] = await db(this.tableName).where({ id }).select("*");

    return user;
  }

  // Find user by email or username
  static async findByEmailOrUsername(email, username) {
    const [user] = await db(this.tableName)
      .where({ email: email.toLowerCase() })
      .orWhere({ username })
      .select("*");

    return user;
  }

  // Update user
  static async updateById(id, updateData) {
    const [user] = await db(this.tableName)
      .where({ id })
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .returning("*");

    return user;
  }

  // Update last login
  static async updateLastLogin(id) {
    const [user] = await db(this.tableName)
      .where({ id })
      .update({
        last_login: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return user;
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Get public user data (without password)
  static toPublicJSON(user) {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  // Get all users (for admin purposes)
  static async findAll() {
    return await db(this.tableName).select(
      "id",
      "username",
      "email",
      "first_name",
      "last_name",
      "profile_picture",
      "bio",
      "is_active",
      "created_at",
      "updated_at"
    );
  }

  // Delete user
  static async deleteById(id) {
    return await db(this.tableName).where({ id }).del();
  }
}

module.exports = User;
