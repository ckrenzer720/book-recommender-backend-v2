exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user_genres").del();

  // Inserts seed entries
  return knex("user_genres").insert([
    // Admin user - likes multiple genres
    {
      user_id: 1,
      genre: "fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 1,
      genre: "non-fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 1,
      genre: "science-fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // John Doe - fiction and fantasy lover
    {
      user_id: 2,
      genre: "fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      genre: "fantasy",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      genre: "science-fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      genre: "mystery",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // Jane Smith - mystery and thriller enthusiast
    {
      user_id: 3,
      genre: "mystery",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 3,
      genre: "thriller",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 3,
      genre: "crime",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 3,
      genre: "fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
