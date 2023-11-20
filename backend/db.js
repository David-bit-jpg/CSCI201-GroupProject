const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
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
