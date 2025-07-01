const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();

  // Hash passwords
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Inserts seed entries
  return knex("users").insert([
    {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      first_name: "Admin",
      last_name: "User",
      bio: "System administrator",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      username: "john_doe",
      email: "john@example.com",
      password: hashedPassword,
      first_name: "John",
      last_name: "Doe",
      bio: "Book enthusiast and avid reader",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      username: "jane_smith",
      email: "jane@example.com",
      password: hashedPassword,
      first_name: "Jane",
      last_name: "Smith",
      bio: "Loves mystery and thriller novels",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
