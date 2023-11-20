const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectToDatabase = () => {
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to the database:', error);
    } else {
      console.log('Connected to the database');
    }
  });
};

const closeConnection = () => {
  connection.end();
  console.log('Connection closed');
};

const performQuery = (query, callback) => {
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      callback(error, null);
    } else {
      console.log('Query results:', results);
      callback(null, results);
    }
  });
};

module.exports = {
  connectToDatabase,
  closeConnection,
  performQuery,
};
