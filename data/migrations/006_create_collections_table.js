exports.up = function (knex) {
  return knex.schema.createTable("collections", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.text("description");
    table.integer("user_id").unsigned().notNullable();
    table.boolean("is_public").defaultTo(true);
    table.string("cover_image", 255);
    table.integer("total_books").defaultTo(0);
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.index("user_id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("collections");
};
