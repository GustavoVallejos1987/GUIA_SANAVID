const { Pool } = require('pg');
require('dotenv').config();

console.log("Conectando a PostgreSQL con URL:");
console.log(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
