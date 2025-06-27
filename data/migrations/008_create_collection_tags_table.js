exports.up = function (knex) {
  return knex.schema.createTable("collection_tags", (table) => {
    table.increments("id").primary();
    table.integer("collection_id").unsigned().notNullable();
    table.string("tag", 30).notNullable();
    table.timestamps(true, true);

    table
      .foreign("collection_id")
      .references("id")
      .inTable("collections")
      .onDelete("CASCADE");
    table.unique(["collection_id", "tag"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("collection_tags");
};
