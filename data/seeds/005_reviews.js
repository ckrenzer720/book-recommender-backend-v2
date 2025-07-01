exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("reviews").del();

  // Inserts seed entries
  return knex("reviews").insert([
    // Reviews for The Great Gatsby
    {
      user_id: 2, // john_doe
      book_id: 1,
      rating: 5,
      review_text:
        "A masterpiece of American literature. Fitzgerald's prose is absolutely beautiful and the story captures the essence of the Jazz Age perfectly.",
      is_public: true,
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-01-15"),
    },
    {
      user_id: 3, // jane_smith
      book_id: 1,
      rating: 4,
      review_text:
        "Beautifully written but quite tragic. The characters are complex and the themes of wealth and love are timeless.",
      is_public: true,
      created_at: new Date("2024-02-20"),
      updated_at: new Date("2024-02-20"),
    },

    // Reviews for To Kill a Mockingbird
    {
      user_id: 1, // admin
      book_id: 2,
      rating: 5,
      review_text:
        "One of the most important books ever written. Harper Lee's portrayal of racial injustice through a child's eyes is powerful and moving.",
      is_public: true,
      created_at: new Date("2024-01-10"),
      updated_at: new Date("2024-01-10"),
    },
    {
      user_id: 2, // john_doe
      book_id: 2,
      rating: 5,
      review_text:
        "A classic that everyone should read. Atticus Finch is one of literature's greatest heroes.",
      is_public: true,
      created_at: new Date("2024-03-05"),
      updated_at: new Date("2024-03-05"),
    },

    // Reviews for 1984
    {
      user_id: 1, // admin
      book_id: 3,
      rating: 4,
      review_text:
        "Disturbing and prophetic. Orwell's vision of totalitarianism is more relevant than ever in our digital age.",
      is_public: true,
      created_at: new Date("2024-02-01"),
      updated_at: new Date("2024-02-01"),
    },
    {
      user_id: 3, // jane_smith
      book_id: 3,
      rating: 3,
      review_text:
        "Interesting concept but quite depressing. The surveillance themes are definitely thought-provoking.",
      is_public: true,
      created_at: new Date("2024-01-25"),
      updated_at: new Date("2024-01-25"),
    },

    // Reviews for The Hobbit
    {
      user_id: 2, // john_doe
      book_id: 4,
      rating: 5,
      review_text:
        "A delightful adventure story! Tolkien's world-building is incredible and Bilbo's journey is both exciting and heartwarming.",
      is_public: true,
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-02-15"),
    },
    {
      user_id: 1, // admin
      book_id: 4,
      rating: 4,
      review_text:
        "A charming fantasy novel that's perfect for readers of all ages. The characters are memorable and the story is engaging.",
      is_public: true,
      created_at: new Date("2024-03-10"),
      updated_at: new Date("2024-03-10"),
    },

    // Reviews for The Da Vinci Code
    {
      user_id: 3, // jane_smith
      book_id: 5,
      rating: 4,
      review_text:
        "Fast-paced and entertaining! The mystery keeps you guessing and the historical elements are fascinating.",
      is_public: true,
      created_at: new Date("2024-02-28"),
      updated_at: new Date("2024-02-28"),
    },
    {
      user_id: 2, // john_doe
      book_id: 5,
      rating: 3,
      review_text:
        "Entertaining thriller with an interesting premise, though some of the historical claims are questionable.",
      is_public: true,
      created_at: new Date("2024-01-30"),
      updated_at: new Date("2024-01-30"),
    },
    {
      user_id: 1, // admin
      book_id: 5,
      rating: 2,
      review_text:
        "The plot is engaging but the writing style is quite formulaic. Good for a quick read but not particularly memorable.",
      is_public: false, // Private review
      created_at: new Date("2024-03-01"),
      updated_at: new Date("2024-03-01"),
    },

    // Reviews for Pride and Prejudice
    {
      user_id: 1, // admin
      book_id: 6,
      rating: 5,
      review_text:
        "Jane Austen's wit and social commentary are unmatched. Elizabeth Bennet is one of literature's most beloved heroines.",
      is_public: true,
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-01-20"),
    },
    {
      user_id: 3, // jane_smith
      book_id: 6,
      rating: 4,
      review_text:
        "A delightful romance with sharp social commentary. The dialogue is brilliant and the characters are unforgettable.",
      is_public: true,
      created_at: new Date("2024-02-10"),
      updated_at: new Date("2024-02-10"),
    },

    // Reviews for The Lord of the Rings
    {
      user_id: 2, // john_doe
      book_id: 7,
      rating: 5,
      review_text:
        "The greatest fantasy epic ever written. Tolkien's world-building is unparalleled and the story is epic in every sense.",
      is_public: true,
      created_at: new Date("2024-01-05"),
      updated_at: new Date("2024-01-05"),
    },
    {
      user_id: 1, // admin
      book_id: 7,
      rating: 5,
      review_text:
        "A masterpiece of fantasy literature. The depth of the world and the complexity of the characters is extraordinary.",
      is_public: true,
      created_at: new Date("2024-02-25"),
      updated_at: new Date("2024-02-25"),
    },

    // Reviews for Gone Girl
    {
      user_id: 3, // jane_smith
      book_id: 8,
      rating: 4,
      review_text:
        "A gripping psychological thriller that keeps you guessing until the very end. The unreliable narrator technique is brilliantly executed.",
      is_public: true,
      created_at: new Date("2024-01-30"),
      updated_at: new Date("2024-01-30"),
    },
    {
      user_id: 2, // john_doe
      book_id: 8,
      rating: 3,
      review_text:
        "Well-written thriller with interesting characters, but quite dark and disturbing. Not for the faint of heart.",
      is_public: true,
      created_at: new Date("2024-03-15"),
      updated_at: new Date("2024-03-15"),
    },

    // Reviews for The Martian
    {
      user_id: 2, // john_doe
      book_id: 9,
      rating: 4,
      review_text:
        "A fantastic science fiction novel that's both scientifically accurate and incredibly entertaining. Mark Watney is a great protagonist.",
      is_public: true,
      created_at: new Date("2024-02-05"),
      updated_at: new Date("2024-02-05"),
    },
    {
      user_id: 1, // admin
      book_id: 9,
      rating: 4,
      review_text:
        "Excellent hard science fiction with a great sense of humor. The problem-solving aspects are fascinating.",
      is_public: true,
      created_at: new Date("2024-01-18"),
      updated_at: new Date("2024-01-18"),
    },

    // Reviews for Sapiens
    {
      user_id: 1, // admin
      book_id: 10,
      rating: 4,
      review_text:
        "A fascinating overview of human history from a unique perspective. Harari's insights are thought-provoking and well-researched.",
      is_public: true,
      created_at: new Date("2024-02-12"),
      updated_at: new Date("2024-02-12"),
    },
    {
      user_id: 2, // john_doe
      book_id: 10,
      rating: 3,
      review_text:
        "Interesting concepts but sometimes oversimplified. Good introduction to big history, though some claims are controversial.",
      is_public: true,
      created_at: new Date("2024-03-08"),
      updated_at: new Date("2024-03-08"),
    },

    // Reviews for The Silent Patient
    {
      user_id: 3, // jane_smith
      book_id: 11,
      rating: 4,
      review_text:
        "A clever psychological thriller with a great twist. The Greek mythology elements add an interesting layer to the story.",
      is_public: true,
      created_at: new Date("2024-02-22"),
      updated_at: new Date("2024-02-22"),
    },
    {
      user_id: 1, // admin
      book_id: 11,
      rating: 3,
      review_text:
        "Decent thriller with a good premise, though the ending felt a bit rushed. The psychological elements are well done.",
      is_public: true,
      created_at: new Date("2024-01-28"),
      updated_at: new Date("2024-01-28"),
    },

    // Reviews for Dune
    {
      user_id: 2, // john_doe
      book_id: 12,
      rating: 5,
      review_text:
        "A masterpiece of science fiction. Herbert's world-building is incredible and the political intrigue is fascinating.",
      is_public: true,
      created_at: new Date("2024-01-12"),
      updated_at: new Date("2024-01-12"),
    },
    {
      user_id: 1, // admin
      book_id: 12,
      rating: 4,
      review_text:
        "Epic science fiction with complex themes of politics, religion, and ecology. A challenging but rewarding read.",
      is_public: true,
      created_at: new Date("2024-03-03"),
      updated_at: new Date("2024-03-03"),
    },
  ]);
};
