exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("book_tags").del();

  // Inserts seed entries
  return knex("book_tags").insert([
    // The Great Gatsby tags
    {
      book_id: 1,
      tag: "classic",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 1,
      tag: "romance",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 1,
      tag: "american-literature",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 1,
      tag: "jazz-age",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // To Kill a Mockingbird tags
    {
      book_id: 2,
      tag: "classic",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 2,
      tag: "coming-of-age",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 2,
      tag: "social-justice",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 2,
      tag: "southern-literature",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // 1984 tags
    {
      book_id: 3,
      tag: "dystopian",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 3,
      tag: "political",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 3,
      tag: "surveillance",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 3,
      tag: "totalitarianism",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // The Hobbit tags
    {
      book_id: 4,
      tag: "fantasy",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 4,
      tag: "adventure",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 4,
      tag: "middle-earth",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 4,
      tag: "quest",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // The Da Vinci Code tags
    {
      book_id: 5,
      tag: "mystery",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 5,
      tag: "thriller",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 5,
      tag: "conspiracy",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 5,
      tag: "religious-mystery",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 5,
      tag: "art-history",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // Pride and Prejudice tags
    {
      book_id: 6,
      tag: "classic",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 6,
      tag: "romance",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 6,
      tag: "british-literature",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 6,
      tag: "social-commentary",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // The Lord of the Rings tags
    {
      book_id: 7,
      tag: "fantasy",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 7,
      tag: "epic",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 7,
      tag: "middle-earth",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 7,
      tag: "quest",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 7,
      tag: "war",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // Gone Girl tags
    {
      book_id: 8,
      tag: "mystery",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 8,
      tag: "psychological-thriller",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 8,
      tag: "domestic-thriller",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 8,
      tag: "unreliable-narrator",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // The Martian tags
    {
      book_id: 9,
      tag: "science-fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 9,
      tag: "space",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 9,
      tag: "survival",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 9,
      tag: "mars",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // Sapiens tags
    {
      book_id: 10,
      tag: "non-fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 10,
      tag: "history",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 10,
      tag: "anthropology",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 10,
      tag: "evolution",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // The Silent Patient tags
    {
      book_id: 11,
      tag: "mystery",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 11,
      tag: "psychological-thriller",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 11,
      tag: "mental-health",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 11,
      tag: "greek-mythology",
      created_at: new Date(),
      updated_at: new Date(),
    },

    // Dune tags
    {
      book_id: 12,
      tag: "science-fiction",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 12,
      tag: "space-opera",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 12,
      tag: "political",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 12,
      tag: "religion",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      book_id: 12,
      tag: "desert",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
