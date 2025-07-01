exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("collections").del();

  // Inserts seed entries
  return knex("collections").insert([
    // Admin's collections
    {
      name: "Essential Classics",
      description:
        "Must-read classic literature that has stood the test of time",
      user_id: 1,
      is_public: true,
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      name: "Dystopian Fiction",
      description:
        "Thought-provoking novels about dark futures and totalitarian societies",
      user_id: 1,
      is_public: true,
      created_at: new Date("2024-02-01"),
      updated_at: new Date("2024-02-01"),
    },

    // John Doe's collections
    {
      name: "Fantasy Adventures",
      description: "Epic fantasy novels that transport you to magical worlds",
      user_id: 2,
      is_public: true,
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-15"),
    },
    {
      name: "My Favorites",
      description: "Personal collection of my all-time favorite books",
      user_id: 2,
      is_public: false, // Private collection
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },

    // Jane Smith's collections
    {
      name: "Mystery & Thriller Masterpieces",
      description:
        "The best mystery and thriller novels that keep you on the edge of your seat",
      user_id: 3,
      is_public: true,
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },
    {
      name: "Books to Read This Year",
      description: "My reading list for 2024",
      user_id: 3,
      is_public: false, // Private collection
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
  ]);
};
