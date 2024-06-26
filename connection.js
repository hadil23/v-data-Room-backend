const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const getConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connecté à la base de données MySQL.');
    return connection;
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err);
    throw err;
  }
};

module.exports = getConnection;
