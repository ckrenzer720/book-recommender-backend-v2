exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("collection_books").del();

  // Inserts seed entries
  return knex("collection_books").insert([
    // Essential Classics collection (collection_id: 1)
    {
      collection_id: 1,
      book_id: 1, // The Great Gatsby
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 1,
      book_id: 2, // To Kill a Mockingbird
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 1,
      book_id: 6, // Pride and Prejudice
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },

    // Dystopian Fiction collection (collection_id: 2)
    {
      collection_id: 2,
      book_id: 3, // 1984
      created_at: new Date("2024-02-01"),
      updated_at: new Date("2024-02-01"),
    },

    // Fantasy Adventures collection (collection_id: 3)
    {
      collection_id: 3,
      book_id: 4, // The Hobbit
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-15"),
    },
    {
      collection_id: 3,
      book_id: 7, // The Lord of the Rings
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-15"),
    },

    // My Favorites collection (collection_id: 4) - John's private collection
    {
      collection_id: 4,
      book_id: 1, // The Great Gatsby
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },
    {
      collection_id: 4,
      book_id: 2, // To Kill a Mockingbird
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },
    {
      collection_id: 4,
      book_id: 4, // The Hobbit
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },
    {
      collection_id: 4,
      book_id: 7, // The Lord of the Rings
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },
    {
      collection_id: 4,
      book_id: 12, // Dune
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },

    // Mystery & Thriller Masterpieces collection (collection_id: 5)
    {
      collection_id: 5,
      book_id: 5, // The Da Vinci Code
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },
    {
      collection_id: 5,
      book_id: 8, // Gone Girl
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },
    {
      collection_id: 5,
      book_id: 11, // The Silent Patient
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },

    // Books to Read This Year collection (collection_id: 6) - Jane's private collection
    {
      collection_id: 6,
      book_id: 1, // The Great Gatsby
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 6,
      book_id: 3, // 1984
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 6,
      book_id: 6, // Pride and Prejudice
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      collection_id: 6,
      book_id: 10, // Sapiens
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
  ]);
};
