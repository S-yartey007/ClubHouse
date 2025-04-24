require("dotenv").config({ path: "../../.env" });
const { Pool } = require("pg");

// Create a new PostgreSQL pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = pool;
