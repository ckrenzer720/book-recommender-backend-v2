const knex = require("knex");
const knexConfig = require("../../knexfile");

// Use test database configuration
const testConfig = knexConfig.test || knexConfig.development;

// Create test database connection
const testDb = knex(testConfig);

// Global test setup
beforeAll(async () => {
  try {
    // Run migrations for test database
    await testDb.migrate.latest();
    // Run seeds for test database
    await testDb.seed.run();
  } catch (error) {
    console.error("Test setup error:", error);
    throw error;
  }
});

// Global test teardown
afterAll(async () => {
  try {
    await testDb.destroy();
  } catch (error) {
    console.error("Test teardown error:", error);
  }
});

// Make testDb available globally for tests
global.testDb = testDb;

// Set NODE_ENV to test to ensure proper configuration
process.env.NODE_ENV = "test";
