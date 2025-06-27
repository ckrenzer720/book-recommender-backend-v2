exports.up = function (knex) {
  return knex.schema.createTable("user_genres", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("genre", 50).notNullable();
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.unique(["user_id", "genre"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_genres");
};
