const { Pool } = require("pg");
require("dotenv").config(); // Add dotenv support

const pool = new Pool({
  host: process.env.DB_HOST || "localhost", // or wherever the db is hosted
  user: process.env.DB_USER || "gcho91",
  database: process.env.DB_NAME || "members_only",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 5432, // The default port
});

module.exports = { pool };
