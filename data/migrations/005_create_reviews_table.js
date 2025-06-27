exports.up = function (knex) {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("book_id").unsigned().notNullable();
    table.integer("rating").notNullable();
    table.string("title", 100);
    table.text("comment");
    table.boolean("is_public").defaultTo(true);
    table.integer("helpful_votes").defaultTo(0);
    table.integer("not_helpful_votes").defaultTo(0);
    table.string("reading_status", 20).defaultTo("finished");
    table.timestamp("date_read");
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("book_id")
      .references("id")
      .inTable("books")
      .onDelete("CASCADE");
    table.unique(["user_id", "book_id"]);
    table.index("book_id");
    table.index("user_id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("reviews");
};
