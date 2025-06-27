const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "data", "book_recommender.db"),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "data", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "data", "seeds"),
    },
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "data", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "data", "seeds"),
    },
  },
  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "data", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "data", "seeds"),
    },
  },
};
