exports.up = function (knex) {
  return knex.schema.createTable("book_tags", (table) => {
    table.increments("id").primary();
    table.integer("book_id").unsigned().notNullable();
    table.string("tag", 30).notNullable();
    table.timestamps(true, true);

    table
      .foreign("book_id")
      .references("id")
      .inTable("books")
      .onDelete("CASCADE");
    table.unique(["book_id", "tag"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("book_tags");
};
