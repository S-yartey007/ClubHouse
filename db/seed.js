// seed.js
require("dotenv").config({ path: "../.env" });
const bcrypt = require("bcrypt");
const pool = require("./pool");

const seed = async () => {
  try {
    await pool.connect();

    console.log("Seeding database...");

    // Clear existing data
    await pool.query("DELETE FROM messages");
    await pool.query("DELETE FROM users");

    // Sample users
    const users = [
      {
        first_name: "Alice",
        last_name: "Wonder",
        email: "alice@example.com",
        password: "password123",
        membership_status: true,
        is_admin: false,
      },
      {
        first_name: "Bob",
        last_name: "Builder",
        email: "bob@example.com",
        password: "password123",
        membership_status: true,
        is_admin: true,
      },
      {
        first_name: "Charlie",
        last_name: "Day",
        email: "charlie@example.com",
        password: "password123",
        membership_status: false,
        is_admin: false,
      },
    ];

    const userIds = [];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, membership_status, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          user.first_name,
          user.last_name,
          user.email,
          hashedPassword,
          user.membership_status,
          user.is_admin,
        ]
      );
      userIds.push(result.rows[0].id);
    }

    // Sample messages
    const messages = [
      {
        title: "Welcome!",
        text: "Hey there, welcome to the Clubhouse.",
        user_id: userIds[0],
      },
      {
        title: "Rules",
        text: "Please be respectful and kind to one another.",
        user_id: userIds[1],
      },
    ];

    for (const msg of messages) {
      await pool.query(
        `INSERT INTO messages (title, text, user_id)
         VALUES ($1, $2, $3)`,
        [msg.title, msg.text, msg.user_id]
      );
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end();
    console.log("Disconnected from database");
  }
};

seed();
