module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  testPathIgnorePatterns: ["/setup.js$"],
  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/app.js"],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
  testTimeout: 10000,
  verbose: true,
};
