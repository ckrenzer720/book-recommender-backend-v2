exports.up = function (knex) {
  return knex.schema.createTable("collection_books", (table) => {
    table.increments("id").primary();
    table.integer("collection_id").unsigned().notNullable();
    table.integer("book_id").unsigned().notNullable();
    table.text("notes");
    table.timestamps(true, true);

    table
      .foreign("collection_id")
      .references("id")
      .inTable("collections")
      .onDelete("CASCADE");
    table
      .foreign("book_id")
      .references("id")
      .inTable("books")
      .onDelete("CASCADE");
    table.unique(["collection_id", "book_id"]);
    table.index("collection_id");
    table.index("book_id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("collection_books");
};
