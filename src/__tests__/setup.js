const knex = require("knex");
const knexConfig = require("../../knexfile");

// Set NODE_ENV to test to ensure proper configuration
process.env.NODE_ENV = "test";

// Use test database configuration
const testConfig = knexConfig.test || knexConfig.development;

// Create test database connection
const testDb = knex(testConfig);

// Global test setup
beforeAll(async () => {
  try {
    console.log("Setting up test database...");
    // Run migrations for test database
    await testDb.migrate.latest();
    console.log("Migrations completed");
    // Run seeds for test database
    await testDb.seed.run();
    console.log("Seeds completed");
  } catch (error) {
    console.error("Test setup error:", error);
    throw error; // Re-throw to fail tests if setup fails
  }
});

// Global test teardown
afterAll(async () => {
  try {
    console.log("Cleaning up test database...");
    await testDb.destroy();
  } catch (error) {
    console.error("Test teardown error:", error);
  }
});

// Make testDb available globally for tests
global.testDb = testDb;
