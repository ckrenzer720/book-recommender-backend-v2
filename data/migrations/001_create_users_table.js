exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username", 30).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("first_name", 50);
    table.string("last_name", 50);
    table.string("profile_picture", 255);
    table.text("bio");
    table.string("reading_level", 20).defaultTo("intermediate");
    table.boolean("is_active").defaultTo(true);
    table.timestamp("last_login").defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
