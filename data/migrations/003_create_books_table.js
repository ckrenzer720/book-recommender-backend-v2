exports.up = function (knex) {
  return knex.schema.createTable("books", (table) => {
    table.increments("id").primary();
    table.string("title", 200).notNullable();
    table.string("author", 100).notNullable();
    table.string("isbn", 20).unique();
    table.text("description");
    table.string("genre", 50).notNullable();
    table.string("sub_genre", 50);
    table.integer("publication_year");
    table.string("publisher", 100);
    table.integer("page_count");
    table.string("language", 20).defaultTo("English");
    table.string("cover_image", 255);
    table.decimal("average_rating", 3, 2).defaultTo(0);
    table.integer("total_ratings").defaultTo(0);
    table.boolean("is_available").defaultTo(true);
    table.integer("added_by").unsigned().notNullable();
    table.timestamps(true, true);

    table
      .foreign("added_by")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.index(["title", "author"]);
    table.index("genre");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("books");
};
