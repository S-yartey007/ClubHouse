// dbSetup.js
require("dotenv").config({ path: "../.env" });
const { Client } = require("pg");

console.log(process.env.DATABASE_URL);
// Create a new PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL, // make sure this is in your .env file
});

const createTables = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        membership_status BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("Tables created or already exist.");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await client.end();
    console.log("Disconnected from database");
  }
};

createTables();
