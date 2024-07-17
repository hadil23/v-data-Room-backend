// test-db-connection.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: "./env" });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('Database connection successful:', rows);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
