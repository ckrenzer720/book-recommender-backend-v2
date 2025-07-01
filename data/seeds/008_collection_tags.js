exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("collection_tags").del();

  // Inserts seed entries
  return knex("collection_tags").insert([
    // Essential Classics collection tags
    {
      collection_id: 1,
      tag: "classic",
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 1,
      tag: "literature",
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 1,
      tag: "must-read",
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },

    // Dystopian Fiction collection tags
    {
      collection_id: 2,
      tag: "dystopian",
      created_at: new Date("2024-02-01"),
      updated_at: new Date("2024-02-01"),
    },
    {
      collection_id: 2,
      tag: "political",
      created_at: new Date("2024-02-01"),
      updated_at: new Date("2024-02-01"),
    },
    {
      collection_id: 2,
      tag: "thought-provoking",
      created_at: new Date("2024-02-01"),
      updated_at: new Date("2024-02-01"),
    },

    // Fantasy Adventures collection tags
    {
      collection_id: 3,
      tag: "fantasy",
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-15"),
    },
    {
      collection_id: 3,
      tag: "adventure",
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-15"),
    },
    {
      collection_id: 3,
      tag: "epic",
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-15"),
    },

    // My Favorites collection tags (private)
    {
      collection_id: 4,
      tag: "favorites",
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },
    {
      collection_id: 4,
      tag: "personal",
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },

    // Mystery & Thriller Masterpieces collection tags
    {
      collection_id: 5,
      tag: "mystery",
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },
    {
      collection_id: 5,
      tag: "thriller",
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },
    {
      collection_id: 5,
      tag: "suspense",
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },

    // Books to Read This Year collection tags (private)
    {
      collection_id: 6,
      tag: "reading-list",
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 6,
      tag: "2024",
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
  ]);
};
