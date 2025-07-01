exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user_genres").del();

  // Inserts seed entries
  return knex("user_genres").insert([
    // Admin user - likes multiple genres
    {
      user_id: 1,
      genre: "fiction",
      preference_level: 5, // 1-5 scale
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 1,
      genre: "non-fiction",
      preference_level: 4,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 1,
      genre: "science-fiction",
      preference_level: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },

    // John Doe - fiction and fantasy lover
    {
      user_id: 2,
      genre: "fiction",
      preference_level: 5,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      genre: "fantasy",
      preference_level: 5,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      genre: "science-fiction",
      preference_level: 4,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      genre: "mystery",
      preference_level: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },

    // Jane Smith - mystery and thriller enthusiast
    {
      user_id: 3,
      genre: "mystery",
      preference_level: 5,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 3,
      genre: "thriller",
      preference_level: 5,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 3,
      genre: "crime",
      preference_level: 4,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 3,
      genre: "fiction",
      preference_level: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
