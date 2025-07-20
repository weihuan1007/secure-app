const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: true // Required by Railway
});

pool.connect((err) => {
  if (err) throw err;
  console.log("PostgreSQL Connected!");
});

module.exports = pool;
