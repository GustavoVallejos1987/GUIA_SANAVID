const { Pool } = require('pg');
require('dotenv').config();
console.log("Conectando a PostgreSQL con:");
console.log("HOST:", process.env.DB_HOST);
console.log("DB:", process.env.DB_NAME);
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASSWORD);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool;
