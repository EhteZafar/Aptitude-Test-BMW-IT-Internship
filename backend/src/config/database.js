const mysql = require('mysql2');

// Create a connection pool - this is more efficient than creating new connections each time
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bmw_aptitude_test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create a promise-based wrapper so we can use async/await
const promisePool = pool.promise();

module.exports = promisePool;

